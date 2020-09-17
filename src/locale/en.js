import en from "vuetify/src/locale/en.ts";
import store from "@/store/index.js";
const pages = {
  home: "Home",
  meta: "Meta Data",
  demo: "Line Demo",
  setting: "Setting",
  about: "About",
  logger: "Logger",
  dropbox: "Works with dropbox",
  loadDropbox: "load dropbox file",
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
      title: "Select your dict complete file (text/plain)"
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
        }
      },
      metadata: {
        label: "New Field"
      },
      video: {
        label: "Video Setting",
        showFrameInVideo: {
          label: "Show frame info"
        }
      },
      loading: {
        label: "File upload settings",
        maxVideoSize: {
          label: "Max Video Size",
          hint:
            "Registerable video size. If this value is large, the number of data that can be registered will decrease."
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
  loading: "Now Loading ...",
  loaded: "The data was loaded",
  notAcceptable: "The data is not acceptable!!",
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
    playPause: "play or pause",
    skip: "skip",
    skipBackward: "skip backward",
    skipForward: "skip forward",
    zoom: "zoom",
    zoom_in: "zoom in",
    zoom_out: "zoom out",
    setting: "setting",
    save: "save",
    saveDropbox: "save to dropbox",
    tier: {
      add: "Add a Tier",
      edit: "Edit a Tier",
      delete: "Delete a Tier"
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
      owakati: "word-separation for the current record",
      oyomi: "Convert current record to reading",
      opronunciation: "Convert current record to pronunciation",
      obasic: "Convert current record to representative type",
      opos: "Convert current record to part of speech"
    },
    frame: {
      name: `Image Annotation`,
      edit: `Show an Image Annotation Dialog`
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
  annotation: "annotation",
  frame: "frames",
  browserError: "This feature is not available in this browser.",
  ver1: "MRI Vuewer ver.1"
};
