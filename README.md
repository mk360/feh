<h1>Fire Emblem Heroes - Phaser 3</h1>

This is an attempt to recreate Fire Emblem Heroes, with the help of the <a href="https://github.com/photonstorm/phaser">Phaser</a> Framework.

This is the UI Repo, which is part of a group that includes:

<ul>
<li>The <a href="https://github.com/mk360/feh-battles">Game Engine</a>, in which all the meat and potatoes lie.</li>
<li>The <a href="https://github.com/mk360/feh-server">HTTP Server</a> that handles connections and acts as a relay between the Engine and the UI.</li>
<li>The <a href="https://github.com/mk360/feh-showdown">Web App</a> that will be the website where you'll be able to play.
</ul>

<h2 id="notes">Notes</h2>
I did my best to create a UI (and game in general) that's as accurate as possible, however I'm probably not going to reach a perfect imitation anytime soon. A few reasons why:
<ul>
<li>IntSys uses assets that don't match 100% with the way they're used in-game. There are a few elements I couldn't find or recreate.</li>
<li>FEH stores animation files (characters in their idle stance, damaged, etc.) in a proprietary format, and I'm not really keen on implementing them. That might change in the future, but for now I'll stick with static images for the sake of simplicity.</li>
</ul>

<h2>Credits and thanks</h2>
<ul>
<li><a href="https://github.com/photonstorm">Richard Davey / Photonstorm</a> for creating the framework.</li>
<li><a href="https://github.com/yandeu">Yannick Deubel</a> for creating this production-ready template.</li>
</ul>

<h2>License</h2>
MIT License, see <a href="https://github.com/mk360/feh/blob/master/LICENSE">the LICENSE file</a> for more details.
