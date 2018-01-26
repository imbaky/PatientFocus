import { Directive, ElementRef, Input, Output, SimpleChanges, HostListener, EventEmitter, OnChanges } from '@angular/core';
import { ColorGenerator } from './color-generator';

@Directive({
  selector: 'text-avatar',
  providers: [ColorGenerator]
})
export class TextAvatarDirective implements OnChanges {
  constructor(private element: ElementRef, private colorGenerator: ColorGenerator) { }

  @Input() text: string;
  @Input() color: string;
  @Input() selected = false;
  @Output() update = new EventEmitter<any>();
  @HostListener('click', ['$event']) onClick(event) {
    event.preventDefault();
    this.selected = !this.selected;
    this.update.emit({ selected: this.selected });
  }

  ngOnChanges(changes: SimpleChanges)  {
    const color = changes['color'] ? changes['color'].currentValue : null;
    if (changes['selected'].currentValue) {
      this.element.nativeElement.setAttribute('value', '✓');
    } else {
      this.element.nativeElement.setAttribute('value', this.text);
    }
    this.element.nativeElement.style.backgroundColor = this.backgroundColorHexString(color, this.text);
  }

  private backgroundColorHexString(color: string, text: string): string {
    return color || this.colorGenerator.getColor(text);
  }
}
