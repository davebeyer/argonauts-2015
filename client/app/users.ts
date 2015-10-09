/// <reference path="../../typings/angular2/angular2.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/firebase/firebase.d.ts" />

import {Component, View} from 'angular2/angular2';

export var User = {};

var FBase;

function updateUserData(authData) {
    User._authData   = authData;

    var provider;

    if (authData) {
        provider = authData.provider;
    } else {
        provider = null;
    }

    switch(provider) {
    case 'google':
        User.isLoggedIn      = true;
        User.firstName       = User._authData.google.cachedUserProfile.given_name;
        User.lastName        = User._authData.google.cachedUserProfile.family_name;
        User.profileImageURL = User._authData.google.profileImageURL;
        break;
    default:
        User.isLoggedIn      = false;
        User.firstName       = null; 
        User.lastName        = null; 
        User.profileImageURL = null;
        break;
    }
}

@Component({
    selector: 'user-block'
})

@View({
    template: `
      <div class="container">
        <div class="signin-form">
          <div [hidden]="user.isLoggedIn">
            <h3 class="form-signin-heading">Please sign in using:</h3>
            <button class="btn btn-lg btn-primary btn-block" (click)="login('google')">  Google  </button>
            <button class="btn btn-lg btn-primary btn-block" (click)="login('facebook')">Facebook</button>
          </div>

          <div [hidden]="!user.isLoggedIn">
            Hello {{user.firstName}} <img src="{{user.profileImageURL}}"/> 
            <a class="btn" (click)="logout()">
              Sign out
            </a>
          </div>
        </div>
      </div>
      `
})

export class UserBlock {
    user : any;
    
    constructor() {
        console.log("main.ts: in UserBlock constructor")

        // Initialize
        updateUserData(null);

        this.user = User;

        FBase = require("./main").FBase;

        // Register the authentication callback
        FBase.onAuth(function(authData) {
            updateUserData(authData);
        });

        console.log("main.ts: finished UserBlock constructor")
    }

    login(provider) {
        if (provider === 'facebook') {
            alert("Sorry, Facebook signin not yet supported");
            return;
        }

        FBase.authWithOAuthPopup(provider, function(error, authData) {
            if (error) {
                if (error.code === "TRANSPORT_UNAVAILABLE") {
                    // Could be due to not allowing pop-ups in this env
                    FBase.authWithOAuthRedirect("google", function(error) {
                        if (error) {
                            console.log("Login Failed!", error);
                        } 
                    });
                } else {
                    console.log("Login Failed!", error);
                }
            } else if (authData) {
                updateUserData(authData); // accelerate the process a little
                console.log("Authenticated successfully with payload:", authData);
            } else {
                console.log("Login apparently failed, but without error info");
            }
        });
    }

    logout() {
        FBase.unauth();
        updateUserData(null);
    }
}
