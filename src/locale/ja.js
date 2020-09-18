import ja from "vuetify/src/locale/ja.ts";
import store from "@/store/index.js";
const NEW = "新規";
const DELETE = "削除";
const EDIT = "編集";
const FORM = "記入欄";
const ANNOTATION = "転記";
const DB = "データベース";
const VIDEO = "動画";
const TEXTGRID = {
  name: "時系列転記",
  tier: {
    name: "時系列転記層",
    option: {
      name: "転記層名",
      showRef: "時刻情報をコピーする",
      ref: "対象転記層",
      withText: "コピー時に文字を含む",
      asParent: "コピー元を親にする",
      type: "転記層の種類"
    },
    interval: "境界転記層",
    point: "イベント転記層",
    record: {
      name: "時刻記述",
      no: "レコードが選択されていません"
    }
  }
};
const FRAME = {
  name: "フレーム転記"
};

const pages = {
  home: "ホーム",
  meta: "メタデータ管理",
  demo: "ライブデモ",
  setting: "設定",
  about: "このアプリについて",
  logger: "ロガー",
  dropbox: {
    auth: "ドロップボックス連携",
    connected: "連携済み",
    load: "ファイル取り込み"
  },
  db: {
    clear: `${DB}の${DELETE}`,
    dump: `${DB}のエクスポート`,
    load: `${DB}のインポート (JSON)`,
    add: `${VIDEO}登録`
  },
  on: {
    destroy: `{0} のデータは${DELETE}されました.`,
    dump: `${DB}はエクスポートされました.`,
    load: `${DB}は更新されました`,
    clear: `すべてのデータを${DELETE}しました`
  }
};
const homeActions = {
  upload: {
    title: pages.db.add,
    hint: `時系列転${ANNOTATION}の${VIDEO}ファイルをインポートします`
  },
  manage: {
    title: pages.meta,
    hint: `インポートした${VIDEO}のメタデータを管理します`
  },
  demo: {
    title: pages.demo,
    hint: "サンプルデータを取り込みライブデモを行います"
  }
};
const home = {
  disc: `
    MRI Vuewer は ${VIDEO} 化された rtMRI データの ${ANNOTATION} ツールです.
    </br>
    音声波形と ${VIDEO} を同時に閲覧することが可能です.
    </br>
    </br>
    全てのファイルはローカルで処理をされます.
    </br>
    まずは <b>${homeActions.upload.title}</b> より
    御自身の ${VIDEO} ファイルを登録してみてください.
    `,
  ...homeActions
};

export default {
  ...ja,
  prev: "戻る",
  validations: {
    required: "この項目は必須項目です!",
    positiveInteger: "この項目は正の整数です!",
    positiveIntegerOrError: "この項目は正の整数または -1 です",
    positiveFloat: "この項目は正の数値です!",
    more: "この項目は {0} より大きい必要があります",
    less: "この項目は {0} より小さい必要があります",
    times: "この項目は {0} の倍数です",
    maxVideoSize: `登録可能な ${VIDEO} ファイルサイズは ${store.state.setting.maxVideoSize} MB までです!`,
    hasArrayBuffer: "想定外の ${VIDEO} ファイルです [No Array buffer]!",
    shorter: "この値は {0} 文字以下です.",
    alreadyExists: "この値は既に存在しています.",
    notExist: "この値は存在しません"
  },
  forms: {
    db: {
      title: `データベース取り込み${FORM}`,
      warning:
        "この処理を実行すると既存のデータは失われます.処理を実行しますか?",
      messages: {
        stop: "データベースのインポートを停止しました",
        success: "データベースのインポートに成功しました",
        outofmemory: "データベースのインポートに失敗しました [out of memory]"
      }
    },
    video: {
      title: `${VIDEO} 登録 ${FORM}`,
      messages: {
        stop: `${VIDEO} の登録が中止されました`,
        success: `${VIDEO} が登録されました`,
        outofmemory: `${VIDEO} の登録に失敗しました [out of memory]`
      },
      finish: `${VIDEO}の登録に成功しました`,
      restart: `別の${VIDEO}を登録する`,
      steps: {
        select: "ファイル選択",
        confirmation: "コーディック確認",
        meta: "メタデータ登録"
      },
      desc: {
        select: `
        解析を行う ${VIDEO} ファイルを登録します.
        <br />
        登録可能な ${VIDEO} ファイルは mp4 のみです.
        <br />
        <br />
        "ファイル登録時に ${VIDEO} コーディックを確認する." に
        チェックがついている場合, ${VIDEO} のエンコーディング情報を自動で取得します.
        `,
        confirmation:
          "以下の情報を確認し問題がなければ <kbd>OK</kbd> をクリックしてください.",
        meta: `
        ${VIDEO} メタデータの登録を行います.
        </br></br>
        例えば発話者情報を登録する場合,
        </br>
        <code>New field</code> に "発話者" と入力をして
        <kbd>ADD</kbd> ボタンをクリックしてください.
        </br>
        上記処理に成功すると <code>発話者</code> ${FORM} が作成されます.
        </br></br>
        登録された <code>field</code> は次回も使用可能です.
        </br></br>
        作成された全ての${FORM}に値を入力し
        </br>
        <kbd>OK</kbd> ボタンをクリックするとメタデータの登録が完了します.`
      }
    },
    tier: {
      title: `${NEW}${TEXTGRID.tier.name}${FORM}`
    },
    tierEdit: {
      title: `${TEXTGRID.tier.name}${EDIT}${FORM}`,
      warning: `この処理を実施するとこの階層の${ANNOTATION}情報は初期化されます.処理を実行しますか?`
    },
    tierDelete: {
      title: `${TEXTGRID.tier.name}${DELETE}${FORM}`
    },
    detail: {
      title: `${VIDEO} 詳細情報`
    },
    ruler: {
      title: "フレーム計測ダイアログ"
    },
    imageEdit: {
      title: `フレーム${EDIT}モード`
    }
  },
  wVideo: {
    videoPre: {
      label: "前画像"
    },
    video: {
      label: "現画像"
    },
    videoPos: {
      label: "後画像"
    }
  },
  io: {
    db: {
      json: {
        title: `${DB} データを選択してください (json)`
      }
    },
    mVideoInput: {
      title: `${VIDEO}ファイルを選択`,
      hint: `${VIDEO} ファイルは mp4 形式のみをサポートしています`
    },
    completes: {
      title: "補完辞書ファイルを選択 (text/plain)"
    }
  },
  pages: pages,
  home: home,
  meta: {
    disc: `
    このページでは登録された ${VIDEO} ファイルのメタ情報を管理します.
    </br>
    メタ情報として付与する内容は自身で設定することが可能です.
    </br>
    メタ情報は ${VIDEO} の発話者, 撮影日, 発話内容等が想定されます.
    </br>
    メタ情報は ${VIDEO} ファイル検索時に使用されます.
    `
  },
  demo: {
    disc: `
    このページではサンプル ${VIDEO} を使って MRI Vuewer の機能を確認することができます.
    `
  },
  setting: {
    disc: `このページでは MRI Vuewer の設定を行うことができます.`,
    form: {
      app: {
        label: "システム設定",
        timeout: {
          label: "メッセージタイムアウト",
          hint:
            "システムメッセージのタイムアウト時間を設定します.この項目が -1 の場合, メッセージの自動非表示処理が抑制されます."
        },
        showDev: {
          label: "開発者用デモページを表示する"
        }
      },
      video: {
        label: "動画設定",
        showFrameInVideo: {
          label: "フレーム情報を動画に表示する"
        },
        syncPoints: {
          label: "ポイントを動画に表示する"
        },
        syncRects: {
          label: "矩形を動画に表示する"
        }
      },
      metadata: {
        label: "新規フィールド"
      },
      loading: {
        label: "ファイル登録設定",
        maxVideoSize: {
          label: "ファイル最大容量.",
          hint:
            "この項目が大きい場合, 登録可能なファイル数が減ります. 登録可能なファイル数は使用端末のスペックに依存します."
        },
        shouldGetVideoInfo: {
          label: `ファイル登録時に${VIDEO}コーディックを確認する.`,
          hint:
            "この項目が false の場合, ${VIDEO} の時間, fps, 縦横サイズ等を手動で入力することになります."
        },
        shouldGetFrameInfo: {
          label: "ファイル登録時に全てのフレーム画像を取得する.",
          hint:
            "この項目が true の場合, 登録処理に多少の時間がかかります. 一方で解析時には正確なフレーム提示を行います."
        }
      },
      waveform: {
        label: "波形表示設定",
        minPxPerSec: {
          label: "pixels per sec",
          hint: `
          1 sec を何ピクセルで表示するか?
          大まかに時刻方向の拡大比率になります.
          この値は50 の倍数である必要があり
          100 - 500 までの値を取ります. 
          `
        },
        cursorColor: {
          label: "カーソル色"
        },
        waveColor: {
          label: "未再生波形色"
        },
        progressColor: {
          label: "再生済み波形色"
        },
        showTimeLine: {
          label: "時間軸を表示する"
        },
        showSpectrogram: {
          label: "スペクトログラムを表示する"
        }
      },
      spectrogram: {
        label: "スペクトログラム表示設定",
        targetChannel: {
          label: "対象チャンネル"
        },
        freqRate: {
          label: "表示周波数率",
          hint:
            "周波数表示比率. fft の解析結果を低域何パーセントまで表示するかです. 0.25 - 1 までの値にしてください"
        },
        spectrogramHeight: {
          label: "スペクトル領域の高さ",
          hint:
            "スペクトログラム表示領域の高さです. 解析幅ではないことに注意してください."
        },
        showFreqLabel: {
          label: "周波数軸ラベルを表示する"
        }
      },
      textgrid: {
        label: `${ANNOTATION} 設定`,
        playOffset: {
          label: "再生オフセット",
          hint: `${TEXTGRID.tier.point} 再生時のオフセットです`
        },
        addRecordKey: {
          label: "レコード追加キー",
          dbl: "ダブルクリック",
          ctrl: "CTRL + クリック",
          alt: "ALT (option) + クリック"
        },
        deleteRecordKey: {
          label: "レコード削除キー",
          delete: "DELETE",
          ctrl: "CTRL + DELETE",
          alt: "ALT + DELETE"
        }
      }
    }
  },
  loading: "読み込み中 ...",
  loaded: "データの読み込みが終了しました",
  notAcceptable: "不正なファイルです",
  yet: "この関数は作成中です",
  textgrid: TEXTGRID,
  annotation: ANNOTATION,
  frame: FRAME,
  browserError: "このブラウザでは, 該当の機能を使用することはできません.",
  contexts: {
    playPause: "再生/停止",
    skip: "スキップ",
    skipBackward: "戻る",
    skipForward: "進む",
    zoom: "ズーム",
    zoom_in: "拡大",
    zoom_out: "縮小",
    setting: "設定",
    save: "保存",
    saveDropbox: "ドロップボックスに保存",
    tier: {
      add: `${TEXTGRID.tier.name} を追加`,
      edit: `${TEXTGRID.tier.name} を編集`,
      delete: `${TEXTGRID.tier.name} を削除`
    },
    record: {
      name: `${TEXTGRID.tier.record.name} 操作`,
      play: `現在${TEXTGRID.tier.record.name}を再生`,
      copy: `現在${TEXTGRID.tier.record.name}をコピー`,
      paste: `現在${TEXTGRID.tier.record.name}にペースト`,
      next: `次の${TEXTGRID.tier.record.name}に移動`,
      prev: `前の${TEXTGRID.tier.record.name}に移動`,
      toStart: `現在${TEXTGRID.tier.record.name}の始端に移動`,
      toEnd: `現在${TEXTGRID.tier.record.name}の終端に移動`,
      extend: `現在${TEXTGRID.tier.record.name}を終端を延長`,
      shrink: `現在${TEXTGRID.tier.record.name}を終端を短縮`,
      splitByFrames: `${TEXTGRID.tier.record.name}の分割 (フレーム毎)`,
      splitByChars: `${TEXTGRID.tier.record.name}の分割 (文字毎)`,
      splitBySlash: `${TEXTGRID.tier.record.name}の分割 (区切り文字毎: /)`,
      owakati: `現在${TEXTGRID.tier.record.name}を分かち書き`,
      oyomi: `現在${TEXTGRID.tier.record.name}をよみに変換`,
      opronunciation: `現在${TEXTGRID.tier.record.name}を発音系に変換`,
      obasic: `現在${TEXTGRID.tier.record.name}を代表系に変換`,
      opos: `現在${TEXTGRID.tier.record.name}を品詞に変換`
    },
    frame: {
      name: `${FRAME.name}`,
      edit: `${FRAME.name} 画面の表示`
    }
  },
  uploads: {
    name: "ファイルアップロード",
    dict: "テキスト補完辞書 (.dict)",
    textgrid: {
      title: `${TEXTGRID.name} のアップロード`,
      textgrid: `TextGrid 形式`,
      json: {
        v1: `JSON 形式 (ver1)`,
        v1left: `JSON 形式 (ver1:left)`,
        v1right: `JSON 形式 (ver1:right)`,
        v2: `JSON 形式 (ver2)`
      }
    }
  },
  downloads: {
    name: "ファイルダウンロード",
    xlsx: "XLSX 形式でダウンロード (ALL)",
    json: "JSON 形式でダウンロード (ALL)",
    png: "PNG 形式でダウンロード (現在)",
    mp4: "MP4 形式でダウンロード (現在)",
    textgrid: {
      title: `${TEXTGRID.name} のダウンロード`,
      textgrid: `TextGrid 形式でダウンロード (${TEXTGRID.name})`,
      json: `JSON 形式でダウンロード (${TEXTGRID.name})`,
      xlsx: `XLSX 形式でダウンロード (${TEXTGRID.name})`
    },
    frame: {
      title: `${FRAME.name} のダウンロード`,
      json: `JSON 形式でダウンロード (${FRAME.name})`,
      xlsx: `XLSX 形式でダウンロード (${FRAME.name})`
    }
  },
  ver1: "MRI Vuewer ver.1 系"
};
//# sourceMappingURL=ja.js.map
