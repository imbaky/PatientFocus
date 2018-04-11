import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';

@Component({
    selector: 'page-help',
    templateUrl: 'help.html'
})
export class HelpPage {
    @ViewChild(Content) content: Content;

    scrollToTop() {
        this.content.scrollToTop();
    }

    scrollTo(element:string) {
        let yOffset = document.getElementById(element).offsetTop;
        this.content.scrollTo(0, yOffset, 4000)
    }
}
