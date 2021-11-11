import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Portal, TemplatePortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FeedStoreItem } from 'src/app/core/feed-service/feed-storage.service';

@Component({
    selector: 'feed-article',
    templateUrl: 'feed-article.component.html',
    styleUrls: ['./feed-article.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[style.display]': 'expanded ? "" : "none"',
    },    
})
export class FeedArticleComponent {

    @Input() feedItem?: FeedStoreItem; 

    @Input()
    get expanded(): boolean {
        return this._expanded;
    }
    set expanded(expanded: boolean) {
        expanded = coerceBooleanProperty(expanded);
        if (this._expanded !== expanded) {
            this._expanded = expanded;
            if (expanded) {
                this.materializeContent();
            }
        }
    }
    private _expanded = false;

    @ViewChild('templatePortalContent') templatePortalContent?: TemplateRef<unknown>;

    templatePortal?: TemplatePortal<any>;

    constructor(private viewContainerRef: ViewContainerRef) { }

    private materializeContent(): void {
        if (this.templatePortalContent) {
            this.templatePortal = new TemplatePortal(
                this.templatePortalContent,
                this.viewContainerRef
            );
        }
    }

}