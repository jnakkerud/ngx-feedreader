import { Channel, Topic } from "./topic.service";

function getChannel(el: Element): Channel {
    return {
        name: el.getAttribute('title') ?? 'Unknown',
        type: el.getAttribute('type') ?? 'rss',
        htmlUrl: el.getAttribute('htmlUrl') ?? 'Unknown',
        xmlUrl: el.getAttribute('xmlUrl') ?? 'Unknown'
    }
}
export class OpmlReader {

    public read(xmlRaw: string): Topic[] {
        // remove the xml declaration as it will cause a parser error
        xmlRaw = xmlRaw.replace(/\<\?xml.+\?\>|\<\!DOCTYPE.+]\>/g, '');

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlRaw, 'text/xml');

        let topics: Topic[] = [];

        let unCategorizedChannels: Channel[] = [];

        const outlines = xmlDoc.getElementsByTagName('outline');
        for (let i = 0, max = outlines.length; i < max; i++) {
            let curr = outlines[i];
            if (curr.hasChildNodes()) {
                topics.push({
                    name: curr.getAttribute('title') ?? 'Unknown',
                    channels: this.channels(curr)
                })
            } else {
                if (curr.hasAttribute('xmlUrl') && curr.parentElement?.tagName !== 'outline') {
                    unCategorizedChannels.push(getChannel(curr));
                }
            }
        }

        if (unCategorizedChannels.length > 0) {
            topics.push({
                name: 'Uncategorized',
                channels: unCategorizedChannels
            });
        }

        return topics;
    }

    private channels(outline: Element): Channel[] {
        let channels: Channel[] = [];
        for (let i = 0; i < outline.children.length; i++) {
            channels.push(getChannel(outline.children[i]));
        }
        return channels;
    }

}