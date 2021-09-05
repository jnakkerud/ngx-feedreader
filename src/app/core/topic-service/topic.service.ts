import { Injectable } from '@angular/core';
import { OpmlReader } from './OpmlReader';

export interface Channel {
    title: string;
    xmlUrl: string;
    htmlUrl: string
}
export interface Topic {
    name: string;
    description?: string;
    channels?: Channel[];
}

const TEST_TOPICS = [
    {
        name: 'Skiing'
    },
    {
        name: 'Development'
    },
    {
        name: 'Housing'
    },
    {
        name: 'Travel'
    }
]

const TEST_OMPL = `
<opml>
<head/>
<body>
<outline title="BigPicEcoNews" text="BigPicEcoNews">
    <outline title="del.icio.us/popular/environment" text="del.icio.us/popular/environment" type="rss" xmlUrl="http://del.icio.us/rss/popular/environment" htmlUrl="http://del.icio.us/popular/environment"/>
    <outline title="Gristmill" text="Gristmill" type="rss" xmlUrl="http://gristmill.grist.org/rss" htmlUrl="http://gristmill.grist.org/"/>
    <outline title="Sprol.com, the worst places in the world" text="Sprol.com, the worst places in the world" type="rss" xmlUrl="http://feeds.feedburner.com/Sprol" htmlUrl="http://www.sprol.com"/>
    <outline title="Treehugger" text="Treehugger" type="rss" xmlUrl="http://www.treehugger.com/index.xml" htmlUrl="http://www.treehugger.com/"/>
    <outline title="WorldChanging: Another World Is Here" text="WorldChanging: Another World Is Here" type="rss" xmlUrl="http://www.worldchanging.com/index.xml" htmlUrl="http://www.worldchanging.com/"/>
</outline>
<outline text="Developer Community" title="Developer Community">
    <outline type="rss" text="DZone.com Feed" title="DZone.com Feed" xmlUrl="http://feeds.dzone.com/dzone/frontpage" htmlUrl="https://dzone.com"/>
    <outline type="rss" text="DEV Community" title="DEV Community" xmlUrl="https://dev.to/feed" htmlUrl="https://dev.to"/>
    <outline type="rss" text="Hacker News" title="Hacker News" xmlUrl="https://news.ycombinator.com/rss" htmlUrl="https://news.ycombinator.com/"/>
    <outline type="rss" text="ProgrammableWeb" title="ProgrammableWeb" xmlUrl="http://feedproxy.google.com/ProgrammableWeb" htmlUrl="https://www.programmableweb.com/rss_blog"/>
</outline>
</body>
</opml>
`

@Injectable({providedIn: 'root'})
export class TopicService {
    constructor() { }
    
    public getTopics(): Topic[] {
        this.testParser();
        return TEST_TOPICS;
    }

    public testParser(): void {
        const opmlReader = new OpmlReader();
        let topics = opmlReader.read(TEST_OMPL);
        console.log(topics);
    }

}