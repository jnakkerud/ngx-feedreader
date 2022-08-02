import { FeedType } from "../topic-service/topic.service";
import { Feed } from "./feed.service";

export function stripTags(str: string): string {
    return str.replace(/(<([^>]+)>)/ig, "");
}

function stripCDataTag(str: string): string {
    const tagStripped = str.replace('<![CDATA[', '');
    return tagStripped.replace(']]>', '');
}

function stripTagsAndCData(str: string): string {
    return stripTags(stripCDataTag(str));
}

function textContent(el: Element | null, defaultVal = 'N/A'): string {
    return el?.textContent ?? defaultVal;
}

// RFC 822
function toDate(el: Element | null): Date {
    return new Date(textContent(el));
}

export class FeedReader {

    DOM_PARSER = new DOMParser().parseFromString.bind(new DOMParser());

    public read(xmlString: string, feedType: FeedType | undefined): Feed {
        let fType = feedType;
        if (!fType) {
            fType = this.getFeedType(xmlString);
        }
        return (fType === 'atom') ? this.parseFeedAtomFormat(xmlString) : this.parseFeedRss(xmlString);
    }
    
    private getFeedType(xmlString: string): FeedType {
        const doc = this.DOM_PARSER(xmlString, 'text/xml');
        if (doc.documentElement.localName === 'feed') {
            return 'atom';
        }
        return 'rss';
    }

    private parseFeedRss(xmlString: string): Feed {
        const doc = this.DOM_PARSER(xmlString, 'text/xml');

        const result: Feed = {
            title: this.checkTag(doc, 'channel title'),
            link: this.checkTag(doc, 'channel link'),
            description: this.checkTag(doc, 'channel description'),
            image: this.checkTag(doc, 'channel image url'),
            type: 'rss',
            items: []
        }

        doc.querySelectorAll('item').forEach((item) => {
            const i = item.querySelector.bind(item);

            const dateEl = i('pubDate') ?? i('date');
            result.items.push({
                title: this.checkTagItem(i, 'title'),
                link: textContent(i('link')),
                description: this.checkTagItemRaw(i, 'description'),
                pubDate: toDate(dateEl)
            });
        });

        return result;
    }

    private parseFeedAtomFormat(xmlString: string): Feed {
        const doc = this.DOM_PARSER(xmlString, 'text/xml');

        const result: Feed = {
            title: this.checkTag(doc, 'title'),
            link: this.checkTag(doc, 'link'),
            type: 'atom',
            items: []
        }        

        doc.querySelectorAll('entry').forEach((item) => {
            const i = item.querySelector.bind(item);

            const elLink = i('link');
            const linkToArticle = (elLink?.getAttribute('href')) ?? 'N/A';

            result.items.push({
                title: this.checkTagItem(i, 'title'),
                link: linkToArticle,
                // Use content or summary
                description: doc.querySelector('content') ? this.checkTagItemRaw(i, 'content') : this.checkTagItemRaw(i, 'summary'),
                pubDate: toDate(i('updated')),
            });

        });

        return result;
    }

    private checkTagItem(i: any, tag: string): string {
        return stripTagsAndCData(textContent(i(tag)));
    }

    private checkTagItemRaw(i: any, tag: string): string {
        return stripCDataTag(textContent(i(tag)));
    }

    private checkTag(doc: Document, tag: string): string {
        const tagToCheck = doc.querySelector(tag);
        return  (tagToCheck) ? stripTagsAndCData(tagToCheck.innerHTML) : 'N/A';
    }

}