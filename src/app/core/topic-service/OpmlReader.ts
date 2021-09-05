import { Channel, Topic } from "./topic.service";

export class OpmlReader {

    public read(xmlRaw: string): Topic[] {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlRaw, 'application/xml');

        let topics: Topic[] = [];

        const outlines = xmlDoc.getElementsByTagName('outline');
        for (let i = 0, max = outlines.length; i < max; i++) {
            let curr = outlines[i];
            if (curr.hasChildNodes()) {
                topics.push({
                    name: curr.getAttribute('title') ?? 'Unknown',
                    channels: this.channels(curr)
                })
            }
        }

        return topics;
    }

    private channels(outline: Element): Channel[] {
        let channels: Channel[] = [];
        for (let i = 0; i < outline.children.length; i++) {
            let channel: Channel = {
                title: outline.children[i].getAttribute('title') ?? 'Unknown',
                htmlUrl: outline.children[i].getAttribute('htmlUrl') ?? 'Unknown',
                xmlUrl: outline.children[i].getAttribute('xmlUrl') ?? 'Unknown'
            }
            channels.push(channel);
        }
        return channels;
    }
}