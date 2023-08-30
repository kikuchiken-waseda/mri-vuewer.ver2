<template>
  <m-frame-editor-context-menu @click="onMenuClick">
    <m-frame-editor-layout ref="layout">
      <template v-slot:toolbar>
        <m-key-context ref="context" @keyup="onKeyup">
          <m-frame-editor-actions
            ref="actions"
            @skip="onSkip"
            @zoom="onZoom"
            @download="onDownload"
          />
        </m-key-context>
      </template>
      <m-key-context ref="context" @keyup="onKeyup">
        <v-stage
          ref="stage"
          v-if="!syncing"
          :config="{ width: cw, height: ch }"
          @mousemove="onStageMouseMove"
          @mousedown="onStageMouseDown"
          @mouseup="onStageMouseUp"
        >
          <v-layer ref="layer">
            <v-image
              ref="background"
              @dblclick="onDblClick"
              :config="background"
            />
          </v-layer>

          <!-- 編集済みのポリゴン -->
          <v-layer ref="layer" v-for="_p in polygons" :key="_p.id">
            <v-line
              v-for="x in _p.lines"
              :key="`${_p.id}-${x.id}`"
              :config="{
                id: `polygon-${_p.id}-${x.id}`,
                polygon_id: _p.id,
                line_id: x.id,
                points: x.points,
                stroke: _p.color || polygon.conf.color,
                strokeWidth:
                  mode == 'pen' ? 3 : _p.size || polygon.conf.size,
                lineCap: 'round',
                lineJoin: 'round'
              }"
              @dblclick="onPolygonLineDblClick"
            />
            <v-circle
              v-for="x in _p.points"
              :key="`polygon-${_p.id}-point-${x.id}`"
              :config="{
                id: `polygon-${_p.id}-point-${x.id}`,
                polygon_id: _p.id,
                point_id: x.id,
                x: x.x,
                y: x.y,
                stroke: 'white',
                strokeWidth: mode == 'pen' ? 0 : 1,
                radius:
                  mode == 'pen' ? 0 : x.size || polygon.conf.size,
                fill: _p.color || polygon.conf.color
              }"
              @click="onPolygonPointClick"
              @mouseenter="onPolygonPointMouseEnter"
              @mouseleave="onPolygonPointMouseLeave"
            />
          </v-layer>

          <v-layer ref="layer">
            <!-- ルーラー -->
            <v-circle
              v-for="x in ruler.points"
              :key="x.id"
              :config="{
                id: x.id,
                x: x.x,
                y: x.y,
                stroke: 'white',
                strokeWidth: 1,
                radius: ruler.conf.size,
                fill: ruler.conf.color
              }"
            />
            <v-line
              v-for="x in ruler.lines"
              :key="x.id"
              :config="{
                id: x.id,
                points: x.points,
                stroke:
                  ruler.active == x.id
                    ? ruler.conf.activeColor
                    : ruler.conf.color,
                strokeWidth:
                  ruler.active == x.id
                    ? ruler.conf.activeSize
                    : ruler.conf.size,
                lineCap: 'round',
                lineJoin: 'round',
                dash: [5, 10]
              }"
              @mouseenter="onRulerMouseEnter"
              @mouseleave="onRulerMouseLeave"
              @dblclick="onRulerDblClick"
            />
            <!-- 編集中のポリゴン -->
            <v-line
              v-for="x in polygon.lines"
              :key="`polygon-${x.id}`"
              :config="{
                id: `polygon-${x.id}`,
                points: x.points,
                stroke:
                  polygon.active === true
                    ? polygon.conf.activeColor
                    : polygon.conf.color,
                strokeWidth: mode == 'pen' ? 2 : polygon.conf.size,
                lineCap: 'round',
                lineJoin: 'round'
              }"
            />
            <v-circle
              v-for="x in cpStartPoints"
              :key="x.id"
              :config="{
                id: `polygon-${x.id}`,
                x: x.x,
                y: x.y,
                stroke: 'white',
                strokeWidth: 1,
                radius: mode == 'pen' ? 0 : polygon.conf.size,
                fill:
                  polygon.active === true
                    ? polygon.conf.activeColor
                    : polygon.conf.color
              }"
              @mouseenter="onPolygonMouseEnter"
              @mouseleave="onPolygonMouseLeave"
              @click="onClickPolygonsPoint"
            />
            <v-circle
              v-for="x in cpPoints"
              :key="x.id"
              :config="{
                id: `polygon-${x.id}`,
                x: x.x,
                y: x.y,
                stroke: 'white',
                strokeWidth: 1,
                radius: mode == 'pen' ? 0 : polygon.conf.size,
                fill:
                  polygon.active === true
                    ? polygon.conf.activeColor
                    : polygon.conf.color
              }"
            />

            <!-- 矩形 -->
            <v-rect
              v-for="x in rects"
              :key="x.name"
              :config="{
                name: x.name,
                id: x.id,
                x: x.x,
                y: x.y,
                width: x.width,
                height: x.height,
                rotation: x.rotation || 1,
                scaleX: x.scaleX || 1,
                scaleY: x.scaleY || 1,
                strokeWidth: x.size || 1,
                draggable: mode == 'rect',
                stroke: colorFilter('rect', x),
                opacity: opacityFilter('rect')
              }"
              @click="onRectClick"
              @dragend="onRectDragEnd"
              @transformend="onTransformEnd"
            />

            <!-- 点群 -->
            <v-circle
              v-for="(x, i) in points"
              :key="i"
              :config="{
                id: x.id,
                x: x.x,
                y: x.y,
                stroke: 'white',
                strokeWidth: 1,
                radius: x.size,
                draggable: mode == 'circ',
                fill: colorFilter('circ', x),
                opacity: opacityFilter('circ')
              }"
              @click="onPointClick"
              @mouseenter="onPointMouseEnter"
              @mouseleave="onPointMouseLeave"
              @dragstart="onPointDragStart"
              @dragend="onPointDragEnd"
            />

            <v-transformer v-if="mode == 'rect'" ref="transformer" />
          </v-layer>

          <m-frame-editor-cursor
            @dblclick="onDblClick"
            v-if="cursor.show"
            v-model="cursor"
          />
        </v-stage>
        <m-loading v-if="syncing" text="$vuetify.loading" />
      </m-key-context>
      <template v-slot:table>
        <m-frame-editor-tab
          :isLoading="syncing"
          @update-point="
            $store.dispatch('current/frame/updatePoint', $event)
          "
          @update-rect="
            $store.dispatch('current/frame/updateRect', $event)
          "
        />
      </template>
    </m-frame-editor-layout>
  </m-frame-editor-context-menu>
</template>
<script>
import { nanoid } from "nanoid";
import MFrameEditorTab from "@/components/tab/MFrameEditorTab";
import MFrameEditorLayout from "@/components/layouts/MFrameEditorLayout";
import MFrameEditorActions from "@/components/actions/MFrameEditorActions";
import MFrameEditorCursor from "@/components/video/MFrameEditorCursor";
import MFrameEditorContextMenu from "@/components/contextmenus/MFrameEditorContextMenu";
import MKeyContext from "@/components/contextmenus/MKeyContext";
import MLoading from "@/components/MLoading";
export default {
  name: "m-frame-editor",
  components: {
    MKeyContext,
    MFrameEditorContextMenu,
    MFrameEditorLayout,
    MFrameEditorActions,
    MFrameEditorCursor,
    MLoading,
    MFrameEditorTab
  },
  props: {
    height: {
      type: String,
      default: "100%"
    },
    value: {
      type: String,
      required: true
    }
  },
  computed: {
    /* 背景画像 */
    src: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    idx: function() {
      return this.$store.state.current.frame.idx;
    },
    /* 画像表示幅 */
    cw: function() {
      return this.$store.state.current.frame.cw;
    },
    /* 画像表示高 */
    ch: function() {
      return this.$store.state.current.frame.ch;
    },
    /* 画像幅 */
    ow: function() {
      return this.$store.state.current.frame.ow;
    },
    /* 画像高 */
    oh: function() {
      return this.$store.state.current.frame.oh;
    },
    /* 登録ずみ点群 */
    points: function() {
      const items = this.$store.getters["current/frame/points"];
      return items.map(x => {
        if (x.size) return x;
        return { ...x, size: 5 };
      });
    },
    /* 登録ずみ矩形 */
    rects: function() {
      return this.$store.getters["current/frame/rects"];
    },
    /* 登録ずみ多角形 */
    polygons: function() {
      const items = this.$store.getters["current/frame/polygons"];
      return items;
    },
    /* 現在編集中の多角形始点ポイント */
    cpStartPoints: function() {
      const items = this.polygon.points.filter(x => x.isFirstPoint);
      return items;
    },
    /* 現在編集中の多角形ポイント */
    cpPoints: function() {
      const items = this.polygon.points.filter(x => !x.isFirstPoint);
      return items;
    },
    mode: {
      get() {
        return this.$store.state.current.frame.mode;
      },
      set(val) {
        this.$store.commit("current/frame/mode", val);
      }
    },
    filter: function() {
      const value = this.$store.state.current.frame.filter;
      if (value) return value.func;
      return null;
    },
    color: function() {
      return this.$store.state.current.frame.color;
    },
    disabledStyle: () => {
      return {
        opacity: 0.5,
        color: "#757575"
      };
    },
    isPointReserved: function() {
      // 入力予定の点群が存在するか
      return this.$store.state.current.frameConf.points.length > 0;
    },
    isRectReserved: function() {
      // 入力予定の矩形が存在するか
      return this.$store.state.current.frameConf.rects.length > 0;
    },
    cardHeight: function() {
      if (this.$store.state.current.layout.mini) {
        return "100%";
      }
      return "80vh";
    }
  },
  data: () => ({
    scale: 0,
    background: {
      image: null
    },
    reservedPoints: [],
    reservedRects: [],
    syncPoints: [],
    syncPolygons: [],
    syncRects: [],
    syncing: false,
    ruler: {
      editable: false,
      active: null,
      conf: {
        size: 3,
        color: "#607D8B",
        activeSize: 5,
        activeColor: "#FFC107"
      },
      points: [],
      lines: []
    },
    polygon: {
      active: false,
      drawing: false,
      conf: {
        size: 5,
        color: "#607D8B",
        activeSize: 7,
        activeColor: "#FFC107"
      },
      points: [],
      lines: []
    },
    selectedShapeName: "",
    cursor: { x: null, y: null, show: false, color: "#00B8D4" },
    tab: null
  }),
  methods: {
    focus: function() {
      this.$refs.context.focus();
    },
    blur: function() {
      this.$refs.context.blur();
    },
    loadImage: async function(src) {
      let $src = src;
      if (this.filter) {
        $src = await this.filter(src, {
          width: this.ow,
          height: this.oh
        });
      }
      const img = await this.$vuewer.io.image.load($src);
      this.onResize();
      this.background.image = img;
      this.focus();
    },
    copyImage: async function() {
      const stage = this.$refs.stage.getStage();
      const dataURL = stage.toDataURL();
      const blob = this.$vuewer.io.file.toBlob(dataURL);
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]);
    },
    addEvent: function() {
      const text = this.$store.state.current.frameConf.text || "";
      const time = this.$store.state.current.frame.time;
      const payload = {
        tier: this.$store.state.current.frameConf.targetTier,
        record: { time, text }
      };
      this.$store.dispatch("current/addRecord", payload);
    },
    // 点群データの記述および保存
    async addPoint(x, y, color) {
      const item = { x, y, color };
      if (this.isPointReserved) {
        const tmp = this.reservedPoints.shift();
        if (tmp) {
          if (
            this.points.findIndex(p => p.label == tmp.label) == -1
          ) {
            item.label = tmp.label;
            item.color = tmp.color;
          }
        }
      } else {
        item.label = `points-${this.points.length}`;
      }
      await this.$store.dispatch("current/frame/addPoint", item);
    },
    // 矩形データの記述および保存
    async addRect(x, y, width, height, rotation, color) {
      let item = { x, y, width, height, rotation, color };
      if (this.isRectReserved) {
        const tmp = this.reservedRects.shift();
        if (tmp) {
          if (this.rects.findIndex(r => r.label == tmp.label) == -1) {
            item.name = tmp.label;
            item.label = tmp.label;
            item.color = tmp.color;
            await this.$store.dispatch("current/frame/addRect", item);
          }
        }
      } else {
        const name = `rect-${this.rects.length + 1}`;
        item.name = name;
        item.label = name;
        await this.$store.dispatch("current/frame/addRect", item);
      }
    },
    // 参照線点データの記述
    addRulerPoint: function(x, y) {
      const id = nanoid();
      const label = `ruler-point-${id}`;
      this.ruler.points.push({ id, label, x, y });
      if (this.ruler.points.length % 2 == 0) this.addRulerLine(id);
    },
    // 参照線データの記述
    addRulerLine(pid) {
      const idx = this.ruler.points.findIndex(x => x.id == pid);
      const a = this.ruler.points[idx - 1];
      const b = this.ruler.points[idx];
      const t = (b.y - a.y) / (b.x - a.x);
      const i = a.y - t * a.x;
      const f1 = { x: 0, y: i };
      const f2 = { x: this.cw, y: this.cw * t + i };
      const points = [f1.x, f1.y, f2.x, f2.y];
      const id = nanoid();
      this.ruler.lines.push({ id, points, t, i });
    },
    // ポリゴンを追加
    addPolygon: async function() {
      const id = nanoid();
      const label = `polygon-${id}`;
      const _points = this.polygon.points;
      const lines = _points.slice(1).map((f2, id) => {
        const f1 = _points[id];
        const points = [f1.x, f1.y, f2.x, f2.y];
        return { id: `line-${id}`, points };
      });
      const item = {
        label,
        lines,
        id: label,
        color: this.color,
        points: _points
      };
      await this.$store.dispatch("current/frame/addPolygon", item);
      this.polygon.active = false;
      this.polygon.points = [];
      this.polygon.lines = [];
    },
    // ポリゴンのノードをを追加
    addPolygonPoint: function(x, y) {
      const id = nanoid();
      const label = `polygon-point-${id}`;
      const isFirstPoint = this.polygon.points.length === 0;
      this.polygon.points.push({ id, label, x, y, isFirstPoint });
      if (id > 1) this.setPolygonLine();
    },
    setPolygonLine() {
      // 2 番目の要素から取得
      const _points = this.polygon.points;
      this.polygon.lines = _points.slice(1).map((f2, id) => {
        const f1 = _points[id];
        const points = [f1.x, f1.y, f2.x, f2.y];
        return { id: `line-${id}`, points };
      });
    },
    addLinePoint: function(x, y) {
      const count = this.polygon.points.length;
      const last = this.polygon.points[count - 1];
      if (last) {
        const diff_x = Math.abs(last.x - x);
        const diff_y = Math.abs(last.y - y);
        const offset = this.polygon.conf.size * 2;
        if ((diff_x > offset) | (diff_y > offset)) {
          this.addPolygonPoint(x, y);
        }
      } else {
        this.addPolygonPoint(x, y);
      }
    },
    async convexDefects() {
      const concavosColor = "#3E2723";
      const convexesColor = "#BF360C";
      const _conv = (obj, i, type) => {
        obj.color =
          type == "concavos" ? concavosColor : convexesColor;
        obj.label =
          type == "concavos" ? `concavo-${i}` : `convex-${i}`;
        return obj;
      };
      const defects = await this.$vuewer.image.convexDefects(
        this.src,
        {
          width: this.ow,
          height: this.oh
        }
      );
      const points = defects
        .map(res => {
          const concav = res.concavos.map((obj, i) =>
            _conv(obj, i, "concavos")
          );
          const convex = res.convexes.map((obj, i) =>
            _conv(obj, i, "convexes")
          );
          return concav.concat(convex);
        })
        .flat();
      await this.$store.dispatch("current/frame/addPoints", points);
    },
    // ==============================================
    // フィルター関数
    // ==============================================
    colorFilter(key, item) {
      if ([key, "eras"].findIndex(m => m == this.mode) != -1) {
        return item.color;
      }
      return this.disabledStyle.color;
    },
    opacityFilter(key) {
      if ([key, "eras"].findIndex(m => m == this.mode) != -1) {
        return 1;
      }
      return this.disabledStyle.opacity;
    },
    // ==============================================
    // イベントハンドラ
    // ==============================================
    onMenuClick(payload) {
      if (payload == "SKIP/NEXT") {
        this.onSkip("next");
      } else if (payload == "SKIP/PREV") {
        this.onSkip("prev");
      } else if (payload == "ZOOM/IN") {
        this.onZoom("in");
      } else if (payload == "ZOOM/OUT") {
        this.onZoom("out");
      } else if (payload == "COPY") {
        this.copyImage();
      } else if (payload == "DOWNLOAD") {
        this.onDownload("image");
      } else if (payload == "FILTER/THRESHOLD") {
        this.$store.commit(
          "current/frame/filter",
          "$vuetify.iFilter.threshold"
        );
      } else if (payload == "FILTER/ADAPTIVE") {
        this.$store.commit(
          "current/frame/filter",
          "$vuetify.iFilter.adaptiveThreshold"
        );
      } else if (payload == "FILTER/CANNY") {
        this.$store.commit(
          "current/frame/filter",
          "$vuetify.iFilter.canny"
        );
      } else if (payload == "FILTER/BILATERAL") {
        this.$store.commit(
          "current/frame/filter",
          "$vuetify.iFilter.bilateral"
        );
      } else if (payload == "FILTER/LAPLACIAN") {
        this.$store.commit(
          "current/frame/filter",
          "$vuetify.iFilter.laplacian"
        );
      } else if (payload == "FILTER/CONCAVECONVEX") {
        this.convexDefects();
      } else {
        console.info("onMenuClick", payload);
      }
    },
    onSkip: function(payload) {
      if (payload == "next") {
        if (this.$store.state.setting.syncPrevPoints) {
          this.syncPoints = this.$vuewer.deepCopy(this.points);
        } else {
          this.syncPoints = [];
        }
        if (this.$store.state.setting.syncPrevRects) {
          this.syncRects = this.$vuewer.deepCopy(this.rects);
        } else {
          this.syncRects = [];
        }
      }
      this.$emit("skip", payload);
    },
    onZoom: function(payload) {
      if (payload == "out") {
        if (this.scale > 0) this.scale = 0;
        const cw = this.$refs.layout.getWidth();
        const $cw = cw + 100 * this.scale;
        if ($cw > 300) {
          this.scale = this.scale - 0.5;
          this.loadImage(this.src);
        }
      } else {
        if (this.scale < 0) this.scale = 0;
        const cw = this.$refs.layout.getWidth();
        const $cw = cw + 100 * this.scale;
        if ($cw < 1000) {
          this.scale = this.scale + 0.5;
          this.loadImage(this.src);
        }
      }
    },
    onDownload: function(payload) {
      if (payload == "image") {
        const bname = this.$store.state.current.video.filename.split(
          "."
        )[0];
        const name = `${bname}-f${this.idx}.png`;
        const stage = this.$refs.stage.getStage();
        const dataURL = stage.toDataURL();
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = name;
        link.click();
      }
    },
    onResize: function() {
      const cw = this.$refs.layout.getWidth();
      const ch = (this.oh * cw) / this.ow;
      const $cw = cw + 100 * this.scale;
      const $ch = ch + 100 * this.scale;

      this.$store.commit("current/frame/cw", $cw);
      this.$store.commit("current/frame/ch", $ch);

      this.background.height = $cw;
      this.background.width = $ch;
    },
    // キー操作
    onKeyup: function(payload) {
      const { key, xKey } = this.$vuewer.key.summary(payload);
      if (key == "tab" && xKey == "default") {
        const modes = this.$store.state.current.frame.modes;
        const idx = modes.findIndex(m => m.val == this.mode);
        if (idx !== -1) {
          const next = idx + 1;
          this.mode =
            next == modes.length ? modes[0].val : modes[next].val;
        }
      } else if (key == "c" && xKey == "ctrl") {
        this.copyImage();
      } else if (key == "s" && xKey == "ctrl") {
        this.onDownload("image");
      } else if (key == "i" && xKey == "default") {
        this.cursor.show = true;
      } else if (key == "i" && xKey == "ctrl") {
        if (this.$refs.actions) {
          this.$refs.actions.focus();
        }
      } else if (key == "[" && xKey == "ctrl") {
        this.cursor.show = false;
      } else if (key == "Escape" && xKey == "default") {
        this.cursor.show = false;
      } else if (key == "h" && xKey == "default") {
        if (this.cursor.show)
          this.cursor.x = this.cursor.x - this.cw / 100;
      } else if (key == "l" && xKey == "default") {
        if (this.cursor.show)
          this.cursor.x = this.cursor.x + this.cw / 100;
      } else if (key == "j" && xKey == "default") {
        if (this.cursor.show) {
          this.cursor.y = this.cursor.y - this.ch / 100;
        } else {
          this.onSkip("prev");
        }
      } else if (key == "k" && xKey == "default") {
        if (this.cursor.show) {
          this.cursor.y = this.cursor.y + this.ch / 100;
        } else {
          this.onSkip("next");
        }
      } else if (key == " " && xKey == "default") {
        if (this.cursor.show) {
          // カーサーが存在する場合データの追加
          this.onDblClick();
        } else {
          // 通常はイベント追加
          this.addEvent();
        }
      } else if (key == "h" && xKey == "ctrl") {
        if (this.cursor.show) this.onSkip("prev");
      } else if (key == "j" && xKey == "ctrl") {
        if (this.cursor.show) this.onSkip("prev");
      } else if (key == "k" && xKey == "ctrl") {
        if (this.cursor.show) this.onSkip("next");
      } else if (key == "l" && xKey == "ctrl") {
        if (this.cursor.show) this.onSkip("next");
      } else {
        this.$emit("keyup", payload);
      }
    },
    // image 系イベントハンドラ
    onDblClick: function() {
      if (this.mode == "circ") {
        this.addPoint(this.cursor.x, this.cursor.y, this.color);
      } else if (this.mode == "rect") {
        const width = this.cw / 5;
        const height = this.ch / 5;
        const x = this.cursor.x - width / 2;
        const y = this.cursor.y - height / 2;
        this.addRect(x, y, width, height, 0, this.color);
      } else if (this.mode == "ruler") {
        this.addRulerPoint(this.cursor.x, this.cursor.y);
      } else if (this.mode == "polygon") {
        this.addPolygonPoint(this.cursor.x, this.cursor.y);
      }
    },
    // Polygon 系イベントハンドラ
    onPolygonMouseEnter: function() {
      const points = this.polygon.points;
      this.polygon.active = points.length > 2 ? true : false;
    },
    onPolygonMouseLeave: function() {
      this.polygon.active = false;
    },
    onClickPolygonsPoint: function() {
      // ポリゴンの終了判定およびデータ追加.
      const item = this.polygon.points[0];
      this.addPolygonPoint(item.x, item.y);
      this.addPolygon();
    },
    /* 既存ポリゴンのノードクリック時の操作 */
    onPolygonPointClick: function(e) {
      if (this.mode == "eras") {
        const { polygon_id, point_id } = e.target.attrs;
        if (polygon_id && point_id) {
          this.$store.dispatch("current/frame/deletePolygon", {
            polygon_id
          });
        }
      }
    },
    /* 既存ポリゴンのノードにマウスが入ってきた場合の操作 */
    onPolygonPointMouseEnter: function(e) {
      if (this.mode == "eras" || this.mode == "polygon") {
        const { polygon_id, point_id } = e.target.attrs;
        if (polygon_id && point_id) {
          this.$store.dispatch("current/frame/activePolygonPoint", {
            polygon_id,
            point_id,
            mode: this.mode
          });
        }
      }
    },
    /* 既存ポリゴンのノードからマウスが出た場合の操作 */
    onPolygonPointMouseLeave: function(e) {
      if (this.mode == "eras" || this.mode == "polygon") {
        const { polygon_id, point_id } = e.target.attrs;
        if (polygon_id && point_id) {
          this.$store.dispatch("current/frame/inactivePolygonPoint", {
            polygon_id,
            point_id,
            mode: this.mode
          });
        }
      }
    },
    // 編集済ポリゴンの LINE イベントハンドラ
    onPolygonLineDblClick: async function(e) {
      const { polygon_id, line_id } = e.target.attrs;
      const { x, y } = this.cursor;
      const polygon = this.polygons.find(p => p.id === polygon_id);
      if (polygon) {
        const { lines, points } = polygon;
        const line = lines.find(l => l.id === line_id);
        if (line) {
          const point_idx = points.findIndex(p => {
            return p.x === line.points[0] && p.y === line.points[1];
          });
          const _points = [...points];
          _points.splice(point_idx, 0, {
            x,
            y,
            id: nanoid()
          });
          const item = {
            id: polygon.id,
            size: polygon.size,
            color: polygon.color,
            label: polygon.label,
            frameId: polygon.frameId,
            points: _points
          };
          await this.$store.dispatch(
            "current/frame/addPolygon",
            item
          );
          await this.$store.dispatch("current/frame/deletePolygon", {
            polygon_id
          });
        }
      }
    },
    // Ruler 系イベントハンドラ
    onRulerDblClick: function(e) {
      const id = e.target.attrs.id;
      const { x, y } = this.cursor;
      const idx = this.ruler.lines.findIndex(l => l.id == id);
      if (idx != -1) {
        const line = this.ruler.lines[idx];
        if (this.mode == "eras") {
          const a = this.ruler.points.findIndex(
            p => p.x == line.points[0]
          );
          const b = this.ruler.points.findIndex(
            p => p.x == line.points[2]
          );
          this.ruler.points.splice(a, 1);
          this.ruler.points.splice(b, 1);
          this.ruler.lines.splice(idx, 1);
        } else if (this.mode == "rect") {
          const width = this.cw / 5;
          const height = this.ch / 5;
          const r = (line.t * 180) / Math.PI;
          this.addRect(x, y, width, height, r, this.color);
        } else if (this.mode == "circ") {
          this.addPoint(x, y, this.color);
        } else if (this.mode == "polygon") {
          this.addPolygonPoint(x, y);
        } else if (this.mode == "ruler") {
          if (this.ruler.points.length % 2 === 1) {
            this.addRulerPoint(x, y);
          }
        }
      }
    },
    onRulerMouseEnter: function(e) {
      const id = e.target.attrs.id;
      this.ruler.active = id;
    },
    onRulerMouseLeave: function() {
      this.ruler.active = null;
    },

    // Point 系イベントハンドラ
    onPointClick: function(e) {
      if (this.mode == "eras") {
        const id = e.target.attrs.id;
        if (id) {
          this.$store.dispatch("current/frame/deletePoint", id);
        }
      }
    },
    onPointMouseEnter: function(e) {
      if (this.mode == "eras" || this.mode == "circ") {
        const id = e.target.attrs.id;
        if (id) this.$store.dispatch("current/frame/activePoint", id);
      }
    },
    onPointMouseLeave: function(e) {
      if (this.mode == "eras" || this.mode == "circ") {
        const id = e.target.attrs.id;
        if (id)
          this.$store.dispatch("current/frame/inactivePoint", id);
      }
    },
    onPointDragStart: function(e) {
      const id = e.target.attrs.id;
      if (id) this.$store.dispatch("current/frame/inactivePoint", id);
    },
    onPointDragEnd: function(e) {
      const id = e.target.attrs.id;
      const idx = this.points.findIndex(p => p.id == id);
      if (idx !== -1) {
        const point = this.points[idx];
        point.x = e.target.x();
        point.y = e.target.y();
        this.$store.dispatch("current/frame/updatePoint", point);
      }
    },
    // Rect 系イベントハンドラ
    onRectClick: function(e) {
      if (this.mode == "circ") {
        this.addPoint(e.evt.offsetX, e.evt.offsetY, this.color);
      } else if (this.mode == "eras") {
        const id = e.target.attrs.id;
        if (id) this.$store.dispatch("current/frame/deleteRect", id);
      }
    },
    onRectDragEnd: function(e) {
      const id = e.target.attrs.id;
      const idx = this.rects.findIndex(r => r.id == id);
      if (idx !== -1) {
        const rect = this.rects[idx];
        rect.x = e.target.x();
        rect.y = e.target.y();
        this.$store.dispatch("current/frame/updateRect", rect);
      }
    },
    onStageMouseMove() {
      const cursor = this.$refs.stage.getNode().getPointerPosition();
      this.cursor.x = cursor.x;
      this.cursor.y = cursor.y;
      if (this.mode == "pen" && this.polygon.drawing) {
        this.addLinePoint(this.cursor.x, this.cursor.y);
      }
    },
    onStageMouseDown(e) {
      // ペンモードの場合
      if (this.mode == "pen") {
        this.polygon.drawing = true;
        this.addLinePoint(this.cursor.x, this.cursor.y);
      } else {
        if (e.target === e.target.getStage()) {
          this.selectedShapeName = "";
          this.updateTransformer();
          return;
        }
        const clickedOnTransformer =
          e.target.getParent().className === "Transformer";
        if (clickedOnTransformer) {
          return;
        }
        const name = e.target.name();
        const rect = this.rects.find(r => r.name === name);
        if (rect) {
          this.selectedShapeName = name;
        } else {
          this.selectedShapeName = "";
        }
        this.updateTransformer();
      }
    },
    onStageMouseUp() {
      if (this.mode == "pen") {
        this.polygon.drawing = false;
      }
    },
    onStageTouchStart(e) {
      console.info("onStageTouchStart", e);
    },
    onTransformEnd(e) {
      const idx = this.rects.findIndex(
        r => r.name == this.selectedShapeName
      );
      if (idx !== -1) {
        const rect = this.rects[idx];
        rect.rotation = e.target.rotation();
        rect.width = e.target.width();
        rect.scaleX = e.target.scaleX();
        rect.height = e.target.height();
        rect.scaleY = e.target.scaleY();
        this.$store.dispatch("current/frame/updateRect", rect);
      }
    },
    updateTransformer() {
      if (this.mode == "rect") {
        const transformerNode = this.$refs.transformer.getNode();
        const stage = transformerNode.getStage();
        const { selectedShapeName } = this;
        const selectedNode = stage.findOne("." + selectedShapeName);
        if (selectedNode === transformerNode.node()) {
          return;
        }
        if (selectedNode) {
          transformerNode.nodes([selectedNode]);
        } else {
          transformerNode.nodes([]);
        }
        transformerNode.getLayer().batchDraw();
      }
    },
    close: function() {
      this.scale = 0;
    }
  },
  watch: {
    "$store.state.current.frame.id": async function(val) {
      if (val) {
        // 拡大比率の変更
        this.scale = 0;
        // 予約値の更新
        this.reservedPoints = this.$vuewer.deepCopy(
          this.$store.state.current.frameConf.points
        );
        this.reservedRects = this.$vuewer.deepCopy(
          this.$store.state.current.frameConf.rects
        );
        // 前フレームの値を確認
        if (this.syncPoints.length && this.points.length == 0) {
          this.syncing = true;
          for (const p of this.syncPoints) {
            const item = {
              label: p.label,
              color: p.color,
              x: p.x,
              y: p.y
            };
            await this.$store.dispatch(
              "current/frame/addPoint",
              item
            );
          }
          this.syncing = false;
        }
        if (this.syncRects.length && this.rects.length == 0) {
          this.syncing = true;
          for (const r of this.syncRects) {
            const item = {
              label: r.label,
              color: r.color,
              x: r.x,
              y: r.y,
              scaleX: r.scaleX,
              scaleY: r.scaleY,
              width: r.width,
              height: r.height,
              rotation: r.rotation
            };
            await this.$store.dispatch("current/frame/addRect", item);
          }
          this.syncing = false;
        }
        this.loadImage(this.src);
      }
    },
    "$store.state.current.frameConf.points": function(val) {
      this.reservedPoints = JSON.parse(JSON.stringify(val));
    },
    "$store.state.current.frameConf.rects": function(val) {
      this.reservedRects = JSON.parse(JSON.stringify(val));
    },
    filter: function(val, old) {
      if (val != old) {
        this.loadImage(this.src);
      }
    }
  },
  mounted: function() {
    this.scale = 0;
    this.reservedPoints = JSON.parse(
      JSON.stringify(this.$store.state.current.frameConf.points)
    );
    this.reservedRects = JSON.parse(
      JSON.stringify(this.$store.state.current.frameConf.rects)
    );
    this.loadImage(this.src);
  }
};
</script>
<style scoped></style>
