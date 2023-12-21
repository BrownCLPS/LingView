import React from 'react';
import { ENGLISH, KANIENKEHA } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const aboutPageJSX = {
  [ENGLISH]:
    <div>
      <p>This site is a final project for LING 415/610 at McGill University in Fall 2023. Jinny Choi, Alex Ito, Blair Jackson, Austin Kraft, and Xindi Zhang contributed.
        The students thank Mary Onwá:ri Tekahawáhkwen McDonald and Wíshe Mitchell Mittelstaedt, for generously contributing Kanien'kéha expertise in the course of this project and throughout LING 415/610; and Professor Jessica Coon, for leading this class and supporting this LingView pilot project.
        The stories available on this website are shared with the consent of the speakers. Any errors or misrepresentations are the students' responsibility. </p>
    <h2>About Kanien'kéha</h2>
        <p>Kanien'kéha, also known by the exonym "Mohawk," is a Northern Iroquoian language spoken in what is now called Ontario, Quebec, and New York State. As of 2021, there are approximately 560 L1 speakers and 80 advanced L2 speakers (DeCaire 2023), with many more intermediate speakers.
        Kanien'kéha grammar is known for its large inventory of pronominal prefixes, its polysynthetic morphology, and its frequent usage of noun incorporation.
        </p>
        <p>The Kanien'kehá:ka—the speakers of Kanien'kéha—are leading language revitalization programs including adult immersion, to reestablish generational transmission of the language. This website is intended as a prototype for language resources, to be customized according to community interests and needs.</p>
    <h2>About the orthography</h2>
        <p>In the transcriptions on this site, we generally adhere to the orthography standards established for Kanien'kéha (Lazore 1993), acknowledging that there is dialectal variation in how particular sounds are represented. </p>
    <h2>References and additional resources</h2>
    <ul>
        <li>DeCaire, Oheróhskon Ryan. 2023. The role of adult immersion in Kanien'kéha revitalization. Doctoral dissertation, University of Hawai'i at Hilo.</li>
        <li>Kawennón:nis. Onkwawenna Kentyohkwa. 2023. <a href='https://test.kawennonnis.ca/#/wordmaker'>https://test.kawennonnis.ca/#/wordmaker</a>.</li>
        <li>Lazore, Dorothy. 1993. The Mohawk language standardisation project: Conference report. Technical report. Literacy Ontario.</li>
        <li>Martin, Akwiratékha'. 2023. Tekawennahsonterónnion: Kanien'kéha morphology. Kahnawà:ke: Kanien'kehá:ka Onkwawén:na Raotitióhkwa Onkwawén:na Ionkwaio'ténion. </li>
        <li>Michelson, Karin. 1988. <i>A comparative study of Lake Iroquoian Accent</i>. Dordrecht: Kluwer Academic Publishers.</li>
        <li>Sharing Our Stories. Ionkwaká:raton. 2023. <a href = 'https://www.sharing-our-stories.com/'>https://www.sharing-our-stories.com/</a>.</li>
    </ul>
    </div>,
  [KANIENKEHA]:
    <div>
      <p>Ne ki' website ioteríhonte ne á:iontste' sénha aiòn:ronke' tsi aiontahónhsatate' ne okara'shòn:'a. McGill University ronteweiénhstha nok ò:ni Kanien'kehá:ka rotíhson.</p>
    </div>,
};

export function AboutPage() {
  return <TranslatableText dictionary={aboutPageJSX} />;
}
