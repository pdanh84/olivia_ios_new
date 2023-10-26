
import { Animation } from '@ionic/core';
export namespace CustomAnimations{
    'use strict';
    // export function iosCustomEnterAnimation(AnimationC: Animation, baseEl: HTMLElement, opts?: any) {
    //     const baseAnimation = new AnimationC();
    //     const backdropAnimation = new AnimationC();
    //     backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    //     const wrapperAnimation = new AnimationC();
    //     wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));
    //     wrapperAnimation.beforeStyles({ 'opacity': 1 })
    //         .fromTo('translateY', '-50%', '0%');
    //     backdropAnimation.fromTo('opacity', 0.01, 0.4);
    //     return Promise.resolve(baseAnimation
    //         .addElement(baseEl)
    //         .easing('cubic-bezier(0.36,0.66,0.04,1)')
    //         .duration(400)
    //         .beforeAddClass('show-modal')
    //         .add(backdropAnimation)
    //         .add(wrapperAnimation));
    // }
    
    // export function iosCustomLeaveAnimation(AnimationC: Animation, baseEl: HTMLElement, opts?: any) {
    //     const baseAnimation = new AnimationC();
    //     const backdropAnimation = new AnimationC();
    //     backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    //     const wrapperAnimation = new AnimationC();
    //     const wrapperEl = baseEl.querySelector('.modal-wrapper');
    //     wrapperAnimation.addElement(wrapperEl);
    //     const wrapperElRect = wrapperEl.getBoundingClientRect();
    //     wrapperAnimation.beforeStyles({ 'opacity': 1 })
    //         .fromTo('translateY', '0%', '-50%');
    //     backdropAnimation.fromTo('opacity', 0.4, 0.0);
    //     return Promise.resolve(baseAnimation
    //         .addElement(baseEl)
    //         .easing('ease-out')
    //         .duration(250)
    //         .add(backdropAnimation)
    //         .add(wrapperAnimation));
    // }

    // export function selectDateCustomEnterAnimation(AnimationC: Animation, baseEl: HTMLElement, opts?: any) {
    //     const baseAnimation = new AnimationC();
    //     const backdropAnimation = new AnimationC();
    //     backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    //     const wrapperAnimation = new AnimationC();
    //     wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));
    //     wrapperAnimation.beforeStyles({ 'opacity': 1 })
    //         .fromTo('translateY', '100%', '0%');
    //     backdropAnimation.fromTo('opacity', 0.01, 0.4);
    //     return Promise.resolve(baseAnimation
    //         .addElement(baseEl)
    //         .easing('cubic-bezier(0.36,0.66,0.04,1)')
    //         .duration(400)
    //         .beforeAddClass('show-modal')
    //         .add(backdropAnimation)
    //         .add(wrapperAnimation));
    // }
    
    // export function selectDateCustomLeaveAnimation(AnimationC: Animation, baseEl: HTMLElement, opts?: any) {
    //     const baseAnimation = new AnimationC();
    //     const backdropAnimation = new AnimationC();
    //     backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    //     const wrapperAnimation = new AnimationC();
    //     const wrapperEl = baseEl.querySelector('.modal-wrapper');
    //     wrapperAnimation.addElement(wrapperEl);
    //     const wrapperElRect = wrapperEl.getBoundingClientRect();
    //     wrapperAnimation.beforeStyles({ 'opacity': 1 })
    //         .fromTo('translateY', '0%', '100%');
    //     backdropAnimation.fromTo('opacity', 0.4, 0.0);
    //     return Promise.resolve(baseAnimation
    //         .addElement(baseEl)
    //         .easing('ease-out')
    //         .duration(250)
    //         .add(backdropAnimation)
    //         .add(wrapperAnimation));
    // }
}