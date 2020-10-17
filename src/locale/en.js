import en from "vuetify/src/locale/en.ts";
import store from "@/store/index.js";
const pages = {
  home: "Home",
  meta: "Meta Data",
  demo: "Line Demo",
  setting: "Setting",
  about: "About",
  logger: "Logger",
  dropbox: {
    auth: "Works with dropbox",
    connected: "Connected",
    load: "load dropbox file"
  },
  db: {
    clear: "Clear DB",
    dump: "Export DB",
    load: "Load DB (JSON)",
    add: "Video Registration"
  },
  on: {
    destroy: "{0} was deleted.",
    dump: "The DB was exported.",
    load: "The DB was uploaded",
    clear: "All videos were deleted."
  }
};
const homeActions = {
  upload: {
    title: pages.db.add,
    hint: "Import your video file for annotation"
  },
  manage: {
    title: pages.meta,
    hint: "you can create meta data for video like speaker data"
  },
  demo: {
    title: pages.demo,
    hint: "Try the annotation function using a sample video"
  }
};
const home = {
  disc: `
    MRI Vuewer is an annotation tool for movied rtMRI data.
    </br>
    You can view the audio waveform and the video at the same time.
    </br>
    </br>
    All files are processed locally.
    </br>
    First of all, please register your own video file from <b>${homeActions.upload.title}</b>.
    `,
  ...homeActions
};

export default {
  ...en,
  prev: "Previous",
  table: {
    frame: {
      label: "Label",
      frame: "Frame ID",
      time: "Time",
      color: "Color",
      x: "X",
      y: "Y",
      width: "Width",
      height: "Height",
      rotation: "Rotation",
      scaleX: "Scale (x)",
      scaleY: "Scale (y)"
    },
    file: {
      name: "Name",
      fps: "Frame Rate (fps)",
      lastModifiedAt: "Last modified at",
      duration: "Video duration (sec)",
      size: "Video size (pixels)",
      actions: "File Actions",
      forms: {
        setTier: {
          label: "Set Tiers (name:[interval|point] name2:[interval|point]...)",
          hint: `Gives some textgrid tiers to the selected files. To add a interval tier called IPU, enter "IPU-interval" in input form. And then, click the icon on the right of input form.
          `
        }
      }
    }
  },
  validations: {
    required: "This field is required!",
    positiveInteger: "This is a positive integer field!",
    positiveIntegerOrError: "This is a positive integer or -1 field!",
    positiveFloat: "This is a positive float field!",
    more: "This value is more then {0}",
    less: "This value is less then {0}",
    times: "This value is a multiple of {0}",
    maxVideoSize: `Video size should be less than ${store.state.setting.maxVideoSize} MB!`,
    hasArrayBuffer: "This is an unexpected video file [No Array buffer]!",
    shorter: "This field must be less than {0} characters",
    alreadyExists: "This value alredy exists",
    notExist: "This value does not exist"
  },
  wVideo: {
    videoPre: {
      label: "Previous Image"
    },
    video: {
      label: "Current Image"
    },
    videoPos: {
      label: "Next Image"
    }
  },
  forms: {
    video: {
      title: "VIDEO REGISTRATION FORM",
      finish: "Video registration is complete.",
      restart: "Add Video.",
      messages: {
        stop: "Canceled the video registration.",
        success: "The video was registered successfully!",
        outofmemory: "Video registration failed [out of memory]"
      },
      steps: {
        select: "File Selection",
        confirmation: "Codec Confirmation",
        meta: "Addtion of Meta Data"
      },
      desc: {
        select: `
        Register the video file to be analyzed.
        <br />
        Only mp4 video files can be registered.
        <br />
        <br />
        If "Get video codec at file upload." is checked,
        the encoding information will be acquired automatically.

        `,
        confirmation: `
        Check the following information and press <kbd>OK</kbd> botton
        if everything is OK.`,
        meta: `
        Register the video metadata.
        </br></br>
        For example, when registering speaker information,
        enter "speaker" in <code>New field</code> and click the <kbd>ADD</kbd> button.
        </br>
        If the above process is successful,
        <code>speaker</code> input form will be created.
        </br></br>
        The registered <code>field</code> can be used next time.
        </br></br>
        Fill in all the forms created.
        <br />
        Finally, click the <kbd>OK</kbd> button to register.`
      }
    },
    db: {
      title: "DB IMPORT FORM",
      warning:
        "Existing data will be lost when this process is performed. Do you want to process it?",
      messages: {
        stop: "Canceled the db importing.",
        success: "The db was updating successfully!",
        outofmemory: "The db updating failed [out of memory]"
      }
    },
    tier: {
      title: "NEW TIER FORM"
    },
    tierEdit: {
      title: "EDIT TIER FORM",
      warning:
        "Performing this process will initialize this tier. Do you want to process it?"
    },
    tierDelete: {
      title: "DELETE TIER FORM"
    },
    detail: {
      title: "VIDEO INFORMATION"
    },
    ruler: {
      title: "RULER DIALOG"
    },
    imageEdit: {
      title: "IMAGE EDIT DIALOG"
    }
  },
  io: {
    db: {
      json: {
        title: "Select your db file (json)"
      }
    },
    mVideoInput: {
      title: "Select your video file (mp4)",
      hint: "supported format is mp4"
    },
    completes: {
      title: "Select your dict complete file (text/plain)",
      isTextComplated: "Text Select Mode"
    }
  },
  pages: pages,
  home: home,
  meta: {
    disc: `
    In this page, you can manages the meta information of registered video files.
    </br>
    You can set the content to be added as meta information by yourself.
    </br>
    The meta information is assumed to be the speaker of the video, the shooting date, the content of the utterance, etc.
    </br>
    Meta information is used when searching video files.
    `
  },
  demo: {
    disc: `In this page, you can check the functions of MRI Vuewer with sample videos.`
  },
  setting: {
    disc: `In this page, you can configure the MRI Vuewer.`,
    form: {
      app: {
        label: "System settings",
        timeout: {
          label: "System message time out",
          hint:
            "Sets the timeout period for system messages. Setting this field to -1 will prevent automatic hiding."
        },
        showDev: {
          label: "Show Develop page"
        },
        syncDropbox: {
          label: "Auto backup in dropbox"
        },
        filesOrderKey: {
          label: "File Order",
          choices: {
            default: "Created At",
            name: "File Name",
            lastModifiedAt: "Last Modified At"
          }
        }
      },
      metadata: {
        label: "New Field"
      },
      video: {
        label: "Video Setting",
        showFrameInVideo: {
          label: "Show frame info"
        },
        syncPrevPoints: {
          label: "copy prev points when the frame time was changed"
        },
        syncPrevRects: {
          label: "copy prev rects when the frame time was changed"
        },
        syncPoints: {
          label: "show points in a video"
        },
        syncRects: {
          label: "show rects in a video"
        }
      },
      loading: {
        label: "File upload settings",
        nameFormat: {
          label: "File Name Format",
          show: "Change file name format",
          hint: [
            "Meta data is added when registering a video.",
            "Register some field names you plan to register, separated by'-'.",
            "No extension required.",
            "If you do not want to do this, leave it blank",
            "ex: material-speaker-date-record_id"
          ].join(" ")
        },
        maxVideoSize: {
          label: "Max Video Size",
          hint:
            "Registerable video size. If this value is large, the number of data that can be registered will decrease."
        },
        shouldMovePageAferAddingFile: {
          label: "Move analysis page when uploaded a video file."
        },
        shouldGetVideoInfo: {
          label: "Get video codec at file upload.",
          hint:
            "If this check box is false, you need to manually input fps, image size, etc."
        },
        shouldGetFrameInfo: {
          label: "Get all frame images at file upload.",
          hint:
            "If this check box is true, the file upload will take longer, but an accurate image display will be performed during video analysis."
        }
      },
      waveform: {
        label: "Wave form settings",
        minPxPerSec: {
          label: "pixels per sec",
          hint:
            "How many pixels do you want to display 1 sec? It is roughly the enlargement ratio in the time direction."
        },
        cursorColor: {
          label: "Cursor Color"
        },
        waveColor: {
          label: "Wave Color"
        },
        progressColor: {
          label: "Progress Color"
        },
        showTimeLine: {
          label: "Display Time Axis"
        },
        showSpectrogram: {
          label: "Display spectrogram"
        }
      },
      spectrogram: {
        label: "Spectrogram Settings",
        targetChannel: {
          label: "Target Channel"
        },
        freqRate: {
          label: "Frequency Rate",
          hint:
            "Frequency display ratio. What percentage of the fft analysis result is displayed.Set a value between 0.25 and 1."
        },
        spectrogramHeight: {
          label: "Max Spectrogram Height",
          hint:
            "The height of the spectrogram display area. Note that it is not the parsing width."
        },
        showFreqLabel: {
          label: "Display Frequency Axis Label"
        }
      },
      textgrid: {
        label: "Annotation Settings",
        playOffset: {
          label: "play offset",
          hint: "Offset time for playing the point record."
        },
        addRecordKey: {
          label: "Record add opetetion",
          dbl: "DOUBLE CLICK",
          ctrl: "CTRL + CLICK",
          alt: "ALT + CLICK"
        },
        deleteRecordKey: {
          label: "Record delete opetetion",
          delete: "DELETE",
          ctrl: "CTRL + DELETE",
          alt: "ALT + DELETE"
        }
      }
    }
  },
  converting: "Now Converting ...",
  loading: "Now Loading ...",
  analyzing: "Now Analyzing ...",
  loaded: "The data was loaded",
  sending: "Sending the data to dropbox ...",
  sended: "Sended the data to dropbox",
  notAcceptable: "The data is not acceptable!!",
  notFound: "Your file is not founded.",
  yet: "This function is under construction",
  textgrid: {
    name: "TextGrid",
    tier: {
      name: "Tier",
      option: {
        name: "Tier Name",
        showRef: "Copy Times",
        ref: "Ref Tier Name",
        withText: "With Texts",
        asParent: "Make the copy source as a parent",
        type: "Tier Type"
      },
      interval: "Interval Tier",
      point: "Point Tier",
      record: {
        name: "Time Record",
        no: "No record was selected!"
      }
    }
  },
  contexts: {
    denoising: {
      audio: "Audio Noise Reduction"
    },
    playPause: "play or pause",
    skip: "skip",
    skipBackward: "skip backward",
    skipForward: "skip forward",
    zoom: "zoom",
    zoom_in: "zoom in",
    zoom_out: "zoom out",
    setting: "setting",
    save: "save",
    saveDropbox: "save the data to dropbox",
    loadDropbox: "load the data from dropbox",
    tier: {
      add: "Add a Tier",
      edit: "Edit a Tier",
      delete: "Delete a Tier",
      interval: {
        name: "Interval Tier",
        time2frame: "Match time of records in a current tier to images time",
        owakati: "word-separation for the current tier (for Japanese)",
        oyomi: "Convert current tier to reading (for Japanese)",
        opronunciation: "Convert current tier to pronunciation (for Japanese)"
      }
    },
    record: {
      name: "Record",
      play: "play a current record",
      copy: "copy a text of the current record",
      paste: "paste a text of the current record",
      next: "move to a next record",
      prev: "move to a prev record",
      toStart: "move to start time of a current record",
      toEnd: "move to end time of a current record",
      extend: "extend end time of a current record",
      shrink: "shrink end time of a current record",
      splitByFrames: "split a current record by frames.",
      splitByChars: "split a current record by chars.",
      splitBySlash: "split a current record by slash.",
      owakati: "word-separation for the current record (for Japanese)",
      oyomi: "Convert current record to reading (for Japanese)",
      opronunciation: "Convert current record to pronunciation (for Japanese)",
      obasic: "Convert current record to representative type (for Japanese)",
      opos: "Convert current record to part of speech (for Japanese)"
    },
    frame: {
      name: `Image Annotation`,
      download: "Save a image as png",
      copy: "Copy a image to clipboard",
      edit: `Show an Image Annotation Dialog`,
      deletePoints: `Delete All Points`,
      deleteRects: `Delete All Rects`
    }
  },
  uploads: {
    name: "Upload File",
    dict: "complement dictionary (.dict)",
    textgrid: {
      title: `TEXTGRID`,
      textgrid: `TextGrid`,
      json: {
        v1: `JSON (ver1)`,
        v1left: `JSON (ver1:left)`,
        v1right: `JSON (ver1:right)`,
        v2: `JSON (ver2)`
      }
    }
  },
  downloads: {
    name: "Download File",
    xlsx: "Download as xlsx file (ALL)",
    json: "Download as json file (ALL)",
    png: "Download as png file (CURRENT)",
    mp4: "Download as mp4 file (CURRENT)",
    textgrid: {
      title: "Download of TextGrid Data.",
      textgrid: "Download as textgrid file",
      json: "Download as json file",
      xlsx: "Download as xlsx file"
    },
    frame: {
      title: "Download of Frame Data.",
      json: "Download as json file",
      xlsx: "Download as xlsx file"
    }
  },
  lastModifiedAt: "Last Modified",
  actions: "Actions",
  annotation: "annotation",
  frame: "frames",
  browserError: "This feature is not available in this browser.",
  ver1: "MRI Vuewer ver.1",
  docs: {
    fileRegistration: "File Registration (Japanese only)",
    textgrid: "Time Series Annotation (Japanese only)",
    frameEdit: "Frame Annotation (Japanese only)",
    search: "Searching Annotated Data (Japanese only)",
    dropbox: "Works with Dropbox (Japanese only)"
  },
  iFilter: {
    name: "Image Filer",
    threshold: "Threshold (OTSU)",
    adaptiveThreshold: "Threshold (ADAPTIVE)",
    canny: "Canny",
    bilateral: "Bilateral",
    laplacian: "Laplacian",
    concaveConvex: "Concave‐Convex Defect"
  }
};
