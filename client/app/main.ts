/// <reference path="../../typings/angular2/angular2.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/firebase/firebase.d.ts" />
/// <reference path="../../typings/requirejs/require.d.ts" />
/// <reference path="./music.ts" />

import {Component, View, bootstrap} from 'angular2/angular2';

export var FBase;

var ImageData = null;

var BurnerImages = require('./burning-man-2015-images').BurnerImages;

var ShowMusic = require('./music').ShowMusic;


@Component({
    selector: 'argonauts-show'
})

@View({
    template: `
        <div class="container" id="main-wrapper">

          <show-music (initevent)="registerShowMusic($event)"> </show-music>

          <div id="splash-page" style="width:100%; height: 100%; position:absolute; left: 0; right: 0; z-index: 0">
            <img style="width: 100%; height:100%;" src="#"/>

            <div style="position:absolute; left: 20px;  bottom: 30px; z-index:20; color:#ACCAE6; font: 26px 'times new vespasian'"> 
              <a href="mailto:argonauts.united@gmail.com" target="_blank">argonauts.united@gmail.com</a><br/>
              Burning Man MMXV
            </div>

            <!-- 
               <div style="position:absolute; right: 20px; bottom: 25px; z-index:20; color:#ddd; font-size:22px"> Preparing ... </div>
             -->
          </div>

          <div id="splash-page2" style="width:100%; height: 100%; position:absolute; left: 0; right: 0; z-index: 0; display:none">
            <div style="width:100%; height: 100%; position:absolute; left: 0; right: 0; z-index: 10">
              <img style="width: 100%; height:100%" src="assets/img/argonaut_flag_red_plain.png"/>
            </div>

            <div style="position:relative; top: 80px; z-index:20; color:#444; font: 42px 'times new vespasian'; width: 850px; margin: 0 auto; padding-left:80px"> 
              The Argonauts:<sup style="font-size:60%">*</sup>
              <table style="color: #444; font: 36px 'times new vespasian'; margin: 20px 0 0 20px">
                <tr style="height:100px">
                  <td valign="top" style="width:40px"><b>1.</b></td>
                  <td valign="top">The associated camp of eight virgin burners<br/>at the burn of MMXV<br/>(the original Burning Man Argonauts).</td>
                </tr>
                <tr>
                  <td colspan="2">&nbsp;</td>
                </tr>
                <tr style="height:100px">
                  <td valign="top"><b>2.</b></td>
                  <td valign="top">Those subsequently inducted by reciting<br/>the <b>Argonaut Oath</b> ...</td>
                </tr>
                <tr>
                  <td colspan="2" align="right">  <span style="font-size:60%">* modern-day</span>  </td>
                </tr>
        
              </table>
            </div>

            <div style="position:absolute; left: 20px;  bottom: 30px; z-index:20; color:#ACCAE6; font: 26px 'times new vespasian'"> 
              <a href="mailto:argonauts.united@gmail.com" target="_blank">argonauts.united@gmail.com</a><br/>
              Burning Man MMXV
            </div>

            <div class="prog-bar">
              <div class="prog"></div>
            </div>
          </div>

          <div id="oath-page" style="color: #444; width:100%; height:100%; position:absolute; left: 0; right: 0; z-index: 10; display:none">

            <div style="width:100%; height: 100%; position:absolute; left: 0; right: 0; z-index: 10">
              <img style="width: 100%; height:100%" src="assets/img/argonaut_flag_red_plain.png"/>
            </div>

            <div id="oath" style="width:100%; position:absolute; left: 0; right: 0; top: 60px; text-align:center; z-index: 20">
              <div>
                <span class="title">We the <a href="#" class="word">Argonauts</a>,</span> <br/>
                <span class="subtitle">United by a Common <a href="#" class="word">Spirit</a>, vow to </span><br/><br/>

                <div style="text-align:left; display:inline-block; margin:0 auto">
                  Cherish the  <a href="#" class="word">Unknown</a>, the  <a href="#" class="word">Uncertain</a>, the  <a href="#" class="word">Untried</a>  <br/>
                  &nbsp; Challenge  <a href="#" class="word">Darkness</a>,  <a href="#" class="word">Dogma</a>,  and  <a href="#" class="word">Fear</a>  <br/>
                  Welcome the  <a href="#" class="word">Strange</a>, the  <a href="#" class="word">Dirty</a>, the  <a href="#" class="word">Odd</a>, and <br/>
                  &nbsp; Seek  <a href="#" class="word">Treasure</a>, <a href="#" class="word">Passion</a>, and <a href="#" class="word">Thyself</a>. 

                  <div style="text-align:right; margin:10px 10px 0 0; font-size:20px">
                    Argonaut Dave
                  </div>
                </div>
              </div>
            </div>

            <div style="position:absolute; left: 20px;  bottom: 30px; z-index:20; color:#ACCAE6; font: 26px 'times new vespasian'"> 
              <a href="mailto:argonauts.united@gmail.com" target="_blank">argonauts.united@gmail.com</a><br/>
              Burning Man MMXV
            </div>
            <div style="position:absolute; right: 20px; bottom: 30px; z-index:20; color:#ACCAE6; font-size:18px"> 
              Click on a word, <br/>
              Each has its own slideshow 
            </div>
          </div>

          <div id="slideshow" style="position: absolute; left: 0; top:0; width: 100%; height: 100%; display:none">
            <a class="stop"> &#8617;</a>
            <p class="state-message" style="display:none"> Paused (spacebar to resume)</p>
            <p class="caption" style="display:none"></p>
          </div>

        </div>

        `,
    directives: [ShowMusic]
})

class Argonauts2015 {

    curImageNum : number;
    images      : Array<any>;
    running     : boolean;
    timerId     : number;
    word        : string;

    showMusic   : any;   // ShowMusic; 

    constructor() {
        console.log("main.ts: in Argonauts2015 constructor")
        this.curImageNum = -1;  // start one before
        this.images      = BurnerImages.Response.AlbumImage;
        this.running     = false;
        this.timerId     = null;
        this.word        = '';

        // Note that this may get filled in at a later point
        this.showMusic  = null;
    }

    // Called via 'initevent' event from OpenTrades component
    registerShowMusic(showMusic) {
        this.showMusic = showMusic;

        this.initMusic();
        
        // Register parent (and other initialization) after DB is ready
        this.showMusic.registerParent(self);
    }

    // Lifecycle method
    onInit() {

        var self = this;
        var splashUrl = "assets/img/argonaut_flag_red_plain_w_boat.png";

        $("#splash-page img").attr('src', splashUrl).load(function() {
            console.log("Finished loading splash page image");
            setTimeout(function() {
                $("#splash-page").stop(true, true).fadeOut(2000);
                $("#splash-page2").stop(true, true).fadeIn(2000, function() {
                    var splash2Dur = 7000;

                    $("#splash-page2 .prog").animate({width : "100%"}, splash2Dur);

                    setTimeout(function() {
                        $("#splash-page2").stop(true, true).fadeOut(2000);
                        $("#oath-page").stop(true, true).fadeIn(2000, function() {
                            self.showMusic.play("oath-bg", {volume : 0.5});
                        });
                    }.bind(this), splash2Dur);
                }.bind(this));
            }.bind(this), 2000);
        }.bind(this));

        var defMargin = 130;
        
        $(window).resize(function() {
            $(".chosen-block").css('max-width', $(window).width() - defMargin * 2);
            self.scaleImage($("#slideshow img.active"));
        });

        $("#oath .word").click(function(event) {
            event.preventDefault();
            var $this = $(this);

            self.word = $this.text().toLowerCase();

            $("#oath-page").stop(true, true).fadeOut(2000);
            $("#slideshow").stop(true, true).show();

            // Add a new chosen-word element in the same position as the selected word

            $("#main-wrapper .chosen-block").remove();  // be sure no lingering ones

            var $chosenBlock = $('<div class="chosen-block"><span class="ch-word">' + self.word + '</span> <span class="ch-def"></span></div>');
            $chosenBlock.css({left : $this.offset().left - 20,  // -20 for padding
                              top  : $this.offset().top - 20, 
                              position : 'absolute'});

            $chosenBlock.find(".ch-def").html("");
            $chosenBlock.css('max-width', $(window).width() - defMargin * 2);

            self.getDefinition($chosenBlock.find(".ch-def"));

            setTimeout( function() {
                $chosenBlock.animate({left : defMargin + 'px', top  : '10px'}, 3000);
            }, 2000);

            $("#main-wrapper").append($chosenBlock);

            // Adv to next image then start slideshow using this word as the keyword

            self.nextImage(1, function() {
                self.runSlideshow();
                if (self.showMusic) {
                    self.showMusic.fadeOut("oath-bg");
                    self.showMusic.play(self.word);
                }
            });

            return false;
        });

        $("#slideshow").on("click", ".stop", function(event) {
            event.preventDefault();
            $("#oath-page").stop(true, true).fadeIn(2000);
            $("#slideshow").stop(true, true).fadeOut(2000);

            self.stopSlideshow({stopMusic : true});
            return false;
        });

        $(document).keydown(function(event) {
            console.log("Key pressed: " + event.which);
            if (self.running) {
                switch (event.which) {
                case 32:  // space bar
                    event.preventDefault();
                    self.toggleSlideshowRunState();
                    break;
                case 39:  // right arrow
                case 40:  // down arrow
                    event.preventDefault();
                    self.advanceImage(1);
                    break;
                case 37:  // left arrow
                case 38:  // up arrow
                    event.preventDefault();
                    self.advanceImage(-1);
                    break;
                case 27:  // escape
                    event.preventDefault();
                    $("#oath-page").stop(true, true).fadeIn(2000);
                    $("#slideshow").stop(true, true).fadeOut(2000);
                    self.stopSlideshow({stopMusic : true});
                    break;
                }
            }
            return true;
        });

        console.log("Argonauts2015: onInit");
    }

    getDefinition($where) {
        var defs    = [0,1];
        var word    = this.word;

        switch (word.toLowerCase()) {
        case 'argonauts':
            word = 'Argonaut';
            break;
        case 'spirit':
            defs = [0, 9];
            break;
        case 'unknown':
            defs = [0, 2, 4];
            break;
        case 'untried':
            defs = [0];
            break;
        case 'darkness':
            defs = [0, 2];
            break;
        case 'dogma':
            defs = [0];  // Overwritten below
            break;
        case 'fear':
            defs = [0, 2];
            break;
        case 'strange':
            defs = [0, 1, 3];
            break;
        case 'dirty':
            defs = [0, 4];
            break;
        case 'odd':
            defs = [0, 5];
            break;
        case 'treasure':
            defs = [1];
            break;
        case 'passion':
            defs = [0, 3, 4];
            break;
        }

        var apiKey = "9f63510ab680a9a2504370c0a530c846ba454b12337f0c6c0";
        var url    = "https://api.wordnik.com/v4/word.json/" + word + "/definitions?limit=200&includeRelated=true&useCanonical=false&includeTags=false&api_key=" + apiKey;

        $.ajax({
            dataType : 'jsonp',
            url      : url
        }).done(function(json) {
            var def    = '';
            var newDef;
            var defNum;
            while(defs.length > 0) {
                defNum = defs.shift();
                if (defNum >= json.length) {
                    break;
                }

                newDef = json[defNum].text;

                switch (word.toLowerCase()) {
                case 'odd':
                    newDef = newDef.replace("See Synonyms at strange.", '');
                    break;
                case 'dogma':
                    newDef = 'A doctrine or corpus of doctrines relating to matters such as morality set forth by some authority such as the church.   "The Dogmas of the quiet past are inadequate to the stormy present" (Abraham Lincoln).'
                    break;
                }

                def = def + ' ' + newDef;
            }
            console.log("Defintion response", json);
            $where.html('&#45;' + def);
        }).fail(function(jqxhr, textStatus, error) {
            console.error("Definition request failed: ", textStatus, error);
        });
    }

    imageId(imageObj) {
        // Only assuming smugmug api images for now
        return 'smugmug-' + imageObj.ImageKey;
    }

    imageCaption(imageObj) {
        var caption     = '';
        var img_title   = $.trim(imageObj.Title);
        var img_caption = $.trim(imageObj.Caption);

        if (img_title.length > 0) {
            caption = img_title;
        }

        if (img_caption.length > 0) {
            if (caption.length > 0) { caption += ': '; }
            caption += img_caption;
        }

        caption = caption.replace(/[\-\.\_]+$/, "");

        return caption;
    }

    fadeInImage($img, caption) {
        this.scaleImage($img);  // in case window changed size

        $("#slideshow img").not($img).stop(true, true).fadeOut(2000).removeClass("active");

        $img.stop(true, true).fadeIn(2000).addClass("active");

        // Hide old caption
        $("#slideshow .caption").stop(true, true).fadeOut(2000, function() {
            // Show new caption
            caption = $.trim(caption);
            if (caption.length > 0) {
                $("#slideshow .caption").text(caption);
                $("#slideshow .caption").fadeIn();
            }
        });
    }

    incImageNum(i, dir) {
        i += dir;
        if (i >= this.images.length) {
            i = 0;
        }
        if (i < 0) {
            i =  this.images.length-1;
        }
        return i;
    }

    imageHasKeyword(obj) {
        var keywords = obj.Keywords.split(';');
        var wordLC   = this.word.toLowerCase();

        for (var i = 0; i < keywords.length; i++) {
            if (keywords[i].toLowerCase().indexOf(wordLC) > -1) {
                return true;
            }
        }

        return false;
    }

    nextImageObj(dir) {
        var num   = this.incImageNum(this.curImageNum, dir);
        var count = 0;
        var obj;

        while (count < this.images.length) {
            obj = this.images[num];
            if (this.imageHasKeyword(obj)) {
                this.curImageNum = num;
                return obj;
            }
            num = this.incImageNum(num, dir);
            count ++;
        }

        // No image found with this keyword, so
        // just return the next in the sequence

        this.curImageNum = this.incImageNum(this.curImageNum, dir);
        return this.images[this.curImageNum];
    }

    nextImage(dir, doneCB) {
        var self  = this;

        var imageObj = self.nextImageObj(dir);
        var imageId  = self.imageId(imageObj);
        var caption  = self.imageCaption(imageObj);

        var $img = $("#slideshow #" + imageId);
        
        if ($img.length > 0) {
            self.fadeInImage($img, caption);
            doneCB();
        } else {
            var thumb = imageObj.ThumbnailUrl;
            var src   = thumb.replace("/Th/", "/L/").replace("-Th.", "-L.");

            $img = $('<img id="' + imageId + '" style="display:none" src="' + src + '"/>');

            $img.appendTo("#slideshow").load(function() {
                self.fadeInImage($(this), caption);
                doneCB();
            });

            console.log("New image: ", src);
        }
    }

    scaleImage($img) {
        var containerWidth  = $(window).width();
        var containerHeight = $(window).height();

        var imageWidth      = $img[0].width;
        var imageHeight     = $img[0].height;
        var imageLeft       = 0;
        var imageTop        = 0;

        var scaleTo;

        var heightFactor = containerHeight / imageHeight;
        var widthFactor  = containerWidth  / imageWidth;

        if (heightFactor > widthFactor) {
            // Width-limited, allow 20% trimming before correcting
            if (imageWidth * heightFactor <= containerWidth * 1.15) { 
                scaleTo = 'height';
            } else {
                scaleTo = 'width';
            }
        } else {
            // Height-limited, allow 20% trimming before correcting
            if (imageHeight * widthFactor <= containerHeight * 1.15) { 
                scaleTo = 'width';
            } else {
                scaleTo = 'height';
            }
        }

        switch(scaleTo) {
        case 'width':
            imageHeight = imageHeight * widthFactor;
            imageWidth  = containerWidth;
            imageTop    = (containerHeight - imageHeight) / 2.0;
            break;
        case 'height':
            imageHeight = containerHeight;
            imageWidth  = imageWidth  * heightFactor;
            imageLeft   = (containerWidth - imageWidth) / 2.0;
            break;
        }

        $img.css({width   : imageWidth,
                  height  : imageHeight,
                  top     : imageTop,
                  left    : imageLeft});
        
    }

    advanceImage(dir) {
        var self = this;
        var runningState = self.running; // save before stopping slideshow

        self.stopSlideshow();
        self.nextImage(dir, function() {
            if (runningState) {
                self.runSlideshow();
            }
        });
    }

    toggleSlideshowRunState() {
        if (this.timerId === null) {
            this.resumeSlideshow();
        } else {
            this.pauseSlideshow();
        }
    }

    pauseSlideshow() {
        console.log("Pausing");
        $("#slideshow .state-message").show();

        if (this.timerId !== null) {
            clearTimeout(this.timerId)
        }
        this.timerId = null;
    }

    resumeSlideshow() {
        console.log("Resuming");
        this.runSlideshow({initTimeout : 100});
    }

    stopSlideshow(options?) {
        if (!options) { options = {}; }

        var self = this;

        if (options.stopMusic && this.showMusic) {
            this.showMusic.fadeOut(this.word);
            this.showMusic.play("oath-bg", {volume : 0.5});
        }
        
        self.running = false;
        self.pauseSlideshow();
    }

    runSlideshow(options?) {
        if (!options) {options = {}; }

        var slideTimeout_ms = 6000;

        if (options.initTimeout === undefined) { 
            options.initTimeout =  slideTimeout_ms;
        }

        var self = this;

        self.running = true;
        $("#slideshow .state-message").hide();

        function _nextTick() {
            self.timerId = null;
            if (self.running) {
                self.nextImage(1, function() { _setTimer(slideTimeout_ms); });
            }
        }

        function _setTimer(timout_ms) {
            if (self.timerId !== null) {
                clearTimeout(self.timerId)
            }
            self.timerId = setTimeout(_nextTick, timout_ms);
        }

        _setTimer(options.initTimeout);
    }

    // Music

    initMusic() {
        this.showMusic.addAudio('oath-bg', "", "biking.mp3");

        this.showMusic.addAudio('argonauts', "https://docs.google.com/uc?export=open&id=0B2F9sAQ0AKlyNjlxZ21uUEVEalE", "In-A-Gadda-Da-Vida.mp3");
        this.showMusic.addAudio('spirit',    "https://docs.google.com/uc?export=open&id=0B2F9sAQ0AKlyekxybVRRTHB1ZUU", "Magic_Carpet_Ride.mp3");

        this.showMusic.addAudio('unknown',   "https://docs.google.com/uc?export=open&id=0B2F9sAQ0AKlyMjNHOFh2SUNXc2s", "Stolen_Dance.mp3");
        this.showMusic.addAudio('uncertain', "https://docs.google.com/uc?export=open&id=0B2F9sAQ0AKlyNE1UVmxHSnI2d2s", "Tear_In_My_Heart.mp3");
        this.showMusic.addAudio('untried',   "https://docs.google.com/uc?export=open&id=0B2F9sAQ0AKlyZEpzczhRLWpyVnM", "Come_With_Me_Now.mp3");

        this.showMusic.addAudio('darkness',  "https://docs.google.com/uc?export=open&id=0B2F9sAQ0AKlyakdUNFc1aFUwSW8", "Put_Your_Lights_On.mp3");
        this.showMusic.addAudio('dogma',     "https://docs.google.com/uc?export=open&id=0B2F9sAQ0AKlyMWlfSXpndjdpOTg", "Take_Me_to_Church.mp3");
        this.showMusic.addAudio('fear',      "https://docs.google.com/uc?export=open&id=0B2F9sAQ0AKlyNE83SlNnb1E2T2M", "Devil_In_Me.mp3");

        this.showMusic.addAudio('strange',   "https://docs.google.com/uc?export=open&id=0B2F9sAQ0AKlyWTlMMmhyNG1jUWc", "Take_a_Walk_On_the_Wild_Side.mp3");
        this.showMusic.addAudio('dirty',     "https://docs.google.com/uc?export=open&id=0B2F9sAQ0AKlySkFiZ3poa0t2Tlk", "How_You_Like_Me_Now.mp3");
        this.showMusic.addAudio('odd',       "https://docs.google.com/uc?export=open&id=0B2F9sAQ0AKlyLS05RHBhMVFickE", "Clint_Eastwood.mp3");

        this.showMusic.addAudio('treasure',  "https://docs.google.com/uc?export=open&id=0B2F9sAQ0AKlyVld1T1dkckJlR0E", "Love_Is_All_Around.mp3");
        this.showMusic.addAudio('passion',   "https://docs.google.com/uc?export=open&id=0B2F9sAQ0AKlyT29DTF96NHN3cG8", "Get_Out_of_the_Weee.mp3");
        this.showMusic.addAudio('thyself',   "https://docs.google.com/uc?export=open&id=0B2F9sAQ0AKlyR3cyay0tVzNpLWM", "The_Joker.mp3");
    }
}

$(document).ready(function() {
    bootstrap(Argonauts2015);
});

