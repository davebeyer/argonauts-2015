/// <reference path="../../typings/angular2/angular2.d.ts" />
/// <reference path="../../typings/firebase/firebase.d.ts" />

import {Component, View, EventEmitter} from 'angular2/angular2';

@Component({
    selector: 'show-music',
    events:   ['initevent']     // NOTE that event names must be all lower case
})

@View({
    template: `
        <div id="music-container">
        </div>
        `,
    directives: []
})


export class ShowMusic {

    fadeTimers    : any;

    // initevent emitter
    parent        : any;  
    initevent     : EventEmitter;

    constructor() {
        this.initevent = new EventEmitter();
        this.parent    = null;  // will be set by the parent

        this.fadeTimers = {};
    }

    onInit() {
        console.log("onInit: for ShowMusic", this);
        this.initevent.next(this); // send initevent to parent component
    }

    registerParent(parent) {
        this.parent = parent;
    }

    addAudio(audioId, url, filename, options) {
        if (!options) { options = {}; }

        // <source type="audio/mp4"   class="mp4">  
        var tmpl = `<audio>
                      <source type="audio/ogg"  class="ogg">  
                      <source type="audio/mpeg" class="mp3">
                    </audio>`;

        var $newAudio = $(tmpl);

        if (options.preload) {
            $newAudio.attr('preload', 'auto');
        } else {
            $newAudio.attr('preload', 'none');
        }

        // Debugging, two methods
        // $newAudio.find("source.mp4").attr('src', '/assets/audio/' + filename + '.m4a');

        if (true) {
            $newAudio.find("source.ogg").attr('src', '/assets/audio/' + filename + '.ogg');
            $newAudio.find("source.mp3").attr('src', '/assets/audio/' + filename + '.mp3');
        } else {
            $newAudio.find("source").attr('src', url);
        } 

        $newAudio.attr('id',  'audio-' + audioId);

        // TODO, better way to find this template location using angular2?
        $("#music-container").append($newAudio);
    }

    play(audioId, options) {
        if (!options) { options = {}; }

        if (options.volume === undefined) {
            options.volume = 1.0;
        }

        if (audioId in this.fadeTimers) {
            clearTimeout(this.fadeTimers[audioId].timer);
            delete this.fadeTimers[audioId];
        }

        var $audio = $("#music-container #audio-" + audioId);

        // Cast to <any> to avoid TS errors when setting audio properties below
        var audio  = <any>($audio[0]);  

        // Reset
        audio.loop = true;
        audio.currentTime = 0;
        audio.volume = options.volume;

        if (audio.readyState >= 4) {  // 4 = HAVE_ENOUGH_DATA
            setTimeout(function() {
                // Give browser a moment for the pause to take effect
                audio.play();
            }, 10);

        } else {
            // load/reload this audio element!

            // If not in ready state, then load and wait for canplay event
            // (Otherwise, already in browser's cache and ready to play now)

            audio.load();

            $audio.on("canplay canplaythrough", function() {
                // canplay typically fired first, then
                // canplaythrough fired when browser estimates it 
                // will download in time so that buffering stops do not occur.

                audio.play();
                $audio.off("canplay canplaythrough");  // Remove event handlers
            });
        }

    }

    fadeOut(audioId, options) {
        if (!options) {options = {}; }

        var fadeInfo;

        var $audio = $("#music-container #audio-" + audioId);

        // Cast to <any> to avoid TS errors when setting audio properties below
        var audio  = <any>($audio[0]);  

        if (audioId in this.fadeTimers) {
            fadeInfo = this.fadeTimers[audioId];
        } else {
            fadeInfo = {
                targetVolume : options.targetVolume ? options.targetVolume : 0.0,
                volume       : audio.volume,
                timer        : null
            }
        }

        fadeInfo.timer = setTimeout(function() {
            if (fadeInfo.volume > fadeInfo.targetVolume) {
                fadeInfo.volume = Math.max(0.0, fadeInfo.volume - 0.025);

                audio.volume = fadeInfo.volume;

                // reset timer
                this.fadeOut(audioId);
            } else {
                if (audioId in this.fadeTimers) {
                    delete this.fadeTimers[audioId];
                }
            }
        }.bind(this), 100);

        this.fadeTimers[audioId] = fadeInfo;
    }

    pauseAll() {
        for (var audioId in this.fadeTimers) {
            if (this.fadeTimers[audioId].timer) {
                clearTimeout(this.fadeTimers[audioId].timer);
                delete this.fadeTimers[audioId];
            }
        }

        var $allAudios = $("#music-container audio");
        $allAudios.each(function() {
            this.pause();   // this is the DOM element itself
        });

    }
}

