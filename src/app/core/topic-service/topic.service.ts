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

const TEST_OMPL = `
<?xml version="1.0" encoding="UTF-8"?> 

<opml version="1.0">
    <head>
        <title>Jon subscriptions in feedly Cloud</title>
    </head>
    <body>
        <outline text="Developer Community" title="Developer Community">
            <outline type="rss" text="DZone.com Feed" title="DZone.com Feed" xmlUrl="http://feeds.dzone.com/dzone/frontpage" htmlUrl="https://dzone.com"/>
            <outline type="rss" text="DEV Community" title="DEV Community" xmlUrl="https://dev.to/feed" htmlUrl="https://dev.to"/>
            <outline type="rss" text="Hacker News" title="Hacker News" xmlUrl="https://news.ycombinator.com/rss" htmlUrl="https://news.ycombinator.com/"/>
            <outline type="rss" text="ProgrammableWeb" title="ProgrammableWeb" xmlUrl="http://feedproxy.google.com/ProgrammableWeb" htmlUrl="https://www.programmableweb.com/rss_blog"/>
        </outline>
        <outline text="Ski Alerts" title="Ski Alerts">
            <outline type="rss" text="Chamonix Alert" title="Chamonix Alert" xmlUrl="https://www.google.com/alerts/feeds/05173895962631213926/13998870638330076372"/>
            <outline type="rss" text="Val Thorens Alert" title="Val Thorens Alert" xmlUrl="https://www.google.com/alerts/feeds/05173895962631213926/17504287475334653060"/>
            <outline type="rss" text="St Anton" title="St Anton" xmlUrl="https://www.google.com/alerts/feeds/05173895962631213926/13182981332770854963"/>
            <outline type="rss" text="The Tahoe Daily Snow" title="The Tahoe Daily Snow" xmlUrl="http://opensnow.com/dailysnow/tahoe/rss" htmlUrl="https://opensnow.com/dailysnow/tahoe/rss"/>
            <outline type="rss" text="Unofficial Networks" title="Unofficial Networks" xmlUrl="http://unofficialnetworks.com/feed/" htmlUrl="https://unofficialnetworks.com"/>
            <outline type="rss" text="Backcountry Magazine" title="Backcountry Magazine" xmlUrl="http://backcountrymagazine.com/feed/" htmlUrl="https://backcountrymagazine.com"/>
            <outline type="rss" text="Google Alert - serre chevalier" title="Google Alert - serre chevalier" xmlUrl="https://www.google.com/alerts/feeds/05173895962631213926/1365195187524623115"/>
            <outline type="rss" text="SnowBrains" title="SnowBrains" xmlUrl="http://snowbrains.com/feed/" htmlUrl="https://snowbrains.com"/>
            <outline type="rss" text="Zermatt" title="Zermatt" xmlUrl="https://www.google.com/alerts/feeds/05173895962631213926/1290397037354029896"/>
            <outline type="rss" text="InTheSnow" title="InTheSnow" xmlUrl="https://www.inthesnow.com/feed/" htmlUrl="https://www.inthesnow.com"/>
            <outline type="rss" text="PlanetSKI" title="PlanetSKI" xmlUrl="https://planetski.eu/feed/" htmlUrl="https://planetski.eu"/>
        </outline>
        <outline type="rss" text="tablehopper" title="tablehopper" xmlUrl="http://feeds.feedburner.com/Tablehopper" htmlUrl="http://www.tablehopper.com/"/>
        <outline type="rss" text="Commonwealth Club Radio Program" title="Commonwealth Club Radio Program" xmlUrl="http://audio.commonwealthclub.org/audio/podcast/weekly.xml" htmlUrl="http://www.commonwealthclub.org"/>
        <outline type="rss" text="SocketSite™" title="SocketSite™" xmlUrl="http://www.socketsite.com/atom.xml" htmlUrl="https://socketsite.com"/>
        <outline type="rss" text="Radio Open Source with Christopher Lydon" title="Radio Open Source with Christopher Lydon" xmlUrl="http://www.radioopensource.org/feed/" htmlUrl="https://radioopensource.org"/>
        <outline type="rss" text="O'Reilly Radar - Insight, analysis, and research about emerging technologies." title="O'Reilly Radar - Insight, analysis, and research about emerging technologies." xmlUrl="http://feeds.feedburner.com/oreilly/radar/atom" htmlUrl="https://www.oreilly.com/radar"/>
        <outline type="rss" text="Techmeme" title="Techmeme" xmlUrl="http://www.techmeme.com/index.xml" htmlUrl="http://www.techmeme.com/"/>
        <outline type="rss" text="The Next Web" title="The Next Web" xmlUrl="http://feeds.feedburner.com/thenextweb" htmlUrl="https://thenextweb.com"/>
        <outline type="rss" text="TechCrunch" title="TechCrunch" xmlUrl="http://feeds.feedburner.com/Techcrunch" htmlUrl="https://techcrunch.com"/>
        <outline type="rss" text="CoLiving" title="CoLiving" xmlUrl="https://www.google.com/alerts/feeds/05173895962631213926/5096432560478599062"/>
        <outline type="rss" text="CoHousing" title="CoHousing" xmlUrl="https://www.google.com/alerts/feeds/05173895962631213926/5096432560478600634"/>
    </body>
</opml>
`

@Injectable({providedIn: 'root'})
export class TopicService {

    topics!: Topic[];

    constructor() { }
    
    public getTopics(): Topic[] {
        // get topics from storage:  TopicStorageService
        // if topics not in storage, then see if an OPML file is specified in the url
        //    Load from url and read with OpmlReader. Write to storage
        // else redirect to config screen

        // local storage service: See https://jsstore.net/tutorial/get-started/

        if (!this.topics) {
            const opmlReader = new OpmlReader();
            this.topics = opmlReader.read(TEST_OMPL);
        }


        return this.topics;
    }

    public getTopic(name: string): Topic | undefined {
        return this.getTopics().find(t => t.name === name);
    }

}