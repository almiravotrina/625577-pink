"use strict";

module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    less: {
      style: {
        files: {
          "build/css/style.css": "source/less/style.less"
        }
      }
    },

    postcss: {
      style: {
        options: {
          processors: [
            require("autoprefixer")()
          ]
        },
        src: "build/css/*.css"
      }
    },

    csso: {
      style: {
        options: {
          report: "gzip"
        },
        files: {
          "build/css/style.min.css": ["build/css/style.css"]
        }
      }
    },

    imagemin: {
      images: {
        options: {
          optimizationLevel: 3,
            progressive: true
        },
        files: [{
          expand: true,
          src: ["source/img/**/*.{png,jpg,svg}"]
        }]
      }
    },

    cwebp: {
      images: {
        options: {
          q: 90
        },
        files: [{
          expand: true,
          src: ["source/img/**/*.{png,jpg}"]
        }]
      }
    },

    svgstore: {
      options: {
        includeTitleElement: false
      },
      sprite: {
        files: {
          "build/img/sprites.svg": ["source/img/sprite-*.svg"]
        }
      }
    },

    posthtml: {
      options: {
        use: [require("posthtml-include")()]
      },
      html: {
        files: [
          {
            expand: true,
            cwd: "source",
            src: ["*.html"],
            dest: "build/"
          }
        ]
      }
    },

    browserSync: {
      server: {
        bsFiles: {
          src: [
            "build/*.html",
            "build/css/*.css"
          ]
        },
        options: {
          server: "build/",
          watchTask: true,
          notify: false,
          open: true,
          cors: true,
          ui: false
        }
      }
    },

    watch: {
      html: {
        files: ["source/*.html"],
          task: ["posthtml"]
      },
      style: {
        files: ["source/less/**/*.less"],
        tasks: ["less", "postcss", "csso"]
      }
    },

    copy: {
      build: {
        files: [{
          expand: true,
          cwd: "source",
          src: [
              "fonts/**/*.{woff,woff2}",
              "img/**",
              "js/**"
          ],
          dest: "build"
        }]
      }
    },

    clean: {
      build: ["build"]
    }

  });

  grunt.registerTask("serve", [
    "browserSync",
    "watch"
  ]);

  grunt.registerTask("imageminify", [
      "imagemin",
      "cwebp"
  ])

  grunt.registerTask("build", [
    "clean",
    "copy",
    "less",
    "postcss",
    "csso",
    "svgstore",
    "posthtml"
    ]);
};
