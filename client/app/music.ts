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

    fadeVolume : number;
    fadeTimer  : number;

    // initevent emitter
    parent        : any;  
    initevent     : EventEmitter;

    constructor() {
        this.initevent = new EventEmitter();
        this.parent    = null;  // will be set by the parent

        this.fadeVolume = 1.0;
        this.fadeTimer  = null;
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

        var $newAudio = $('<audio preload="auto"><source type="audio/mpeg"></audio>');  // mp3 audio

        // Debugging, two methods
        if (true) {
            $newAudio.find("source").attr('src', '/assets/audio/' + filename);
        } else {
            $newAudio.find("source").attr('src', url);
        } 

        $newAudio.attr('id',  'audio-' + audioId);

        // TODO, better way to find this template location using angular2?
        $("#music-container").append($newAudio);
    }

    play(audioId, options) {
        if (!options) { options = {}; }

        // Stop all others, jic
        this.pauseAll();

        setTimeout(function() {
            // Give browser a moment for the pause to take effect
            var $audio = $("#music-container #audio-" + audioId);

	    // Cast to <any> to avoid TS errors when setting audio properties below
	    var audio  = <any>($audio[0]);  

            // Reset
            audio.loop = true;
            audio.currentTime = 0;
            audio.volume = 1.0;
            audio.play();
        }, 10);
    }

    fadeOut(audioId, options) {
        if (!options) {options = {}; }

        if (! options.noInit) {
            this.fadeVolume = 1.0;
        }

        this.fadeTimer = setTimeout(function() {
            if (this.fadeVolume > 0.0) {
                this.fadeVolume = Math.max(0.0, this.fadeVolume - 0.025);
                var $audio = $("#music-container #audio-" + audioId);

		// Cast to <any> to avoid TS errors when setting audio properties below
		var audio  = <any>($audio[0]);  

                audio.volume = this.fadeVolume;

                // reset timer
                this.fadeOut(audioId, {noInit: true});
            } else {
                this.fadeTimer = null;
            }
        }.bind(this), 100);
    }

    pauseAll() {
        if (this.fadeTimer) {
            clearTimeout(this.fadeTimer);
            this.fadeTimer = null;
        }

        var $allAudios = $("#music-container audio");
        $allAudios.each(function() {
            this.pause();   // this is the DOM element itself
        });

    }
}

