import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle } from '@angular/platform-browser';

/**
 * 非安全加载URL,比如加载iframe url
 */
@Pipe({
  name: 'trustUrl'
})
export class TrustUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

/**
 * 非安全加载HTML
 */
@Pipe({
  name: 'trustHtml'
})
export class TrustHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(html: string, enabled = true): SafeHtml {
    return enabled ? this.sanitizer.bypassSecurityTrustHtml(html) : html;
  }
}

/**
 * 非安全调用Script
 */
@Pipe({
  name: 'trustScript'
})
export class TrustScriptPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(script: string, enabled = true): SafeScript {
    return enabled ? this.sanitizer.bypassSecurityTrustScript(script) : script;
  }
}

/**
 * 非安全调用Style
 */
@Pipe({
  name: 'trustStyle'
})
export class TrustStylePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(style: string, enabled = true): SafeStyle {
    return enabled ? this.sanitizer.bypassSecurityTrustStyle(style) : style;
  }
}
