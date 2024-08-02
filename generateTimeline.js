// Load wink-nlp package.
const winkNLP = require('wink-nlp');
// Load english language model.
const model = require('wink-eng-lite-web-model');
const fs = require('node:fs');
// Instantiate winkNLP.
const nlp = winkNLP( model );
// Obtain "its" helper to extract item properties.
const its = nlp.its;
// Obtain "as" reducer helper to reduce a collection.
const as = nlp.as;
 
async function timeline(wikiArticleTitle){
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=${wikiArticleTitle}&explaintext=1&formatversion=2&format=json&origin=*`);
    const body = await response.json();
    const text = body.query.pages[0].extract;

    var doc = nlp.readDoc( text || '' );
    var timeline = [];
    doc
        .entities()
        .filter( ( e ) => {
            var shapes = e.tokens().out( its.shape );
            // We only want dates that can be converted to an actual
            // time using new Date()
            return (
                e.out( its.type ) === 'DATE' &&
                (
                    shapes[ 0 ] === 'dddd' ||
                    ( shapes[ 0 ] === 'Xxxxx' && shapes[ 1 ] === 'dddd' ) ||
                    ( shapes[ 0 ] === 'Xxxx' && shapes[ 1 ] === 'dddd' ) ||
                    ( shapes[ 0 ] === 'dd' && shapes[ 1 ] === 'Xxxxx' && shapes[ 2 ] === 'dddd' ) ||
                    ( shapes[ 0 ] === 'dd' && shapes[ 1 ] === 'Xxxx' &&  shapes[ 2 ] === 'dddd' ) ||
                    ( shapes[ 0 ] === 'd' &&  shapes[ 1 ] === 'Xxxxx' && shapes[ 2 ] === 'dddd' ) ||
                    ( shapes[ 0 ] === 'd' &&  shapes[ 1 ] === 'Xxxx' &&  shapes[ 2 ] === 'dddd' )
                )
            );
        })
        .each( ( e ) => {
            e.markup();
            let eventDate = e.out();
            if ( isNaN( eventDate[ 0 ] ) ) eventDate = '1 ' + eventDate;
            timeline.push({
                date: e.out(),
                unixTime: new Date( eventDate ).getTime() / 1000,
                sentence: e.parentSentence().out( its.markedUpText )
            })
        });

    return timeline.sort((a, b) => a.unixTime - b.unixTime);
}

// let result = timeline('History of India')
//     .then((r) => {
//         fs.writeFileSync('./History_of_India_timeline.json', JSON.stringify(r));
//     });

findBestMatch= function ( ri, e ) {
    let index = null;
    if ( ri.query.searchinfo.totalhits === 0 ) return index;
    if ( e.out( its.type ) === 'simpleADJ' && !e.out( its.value ).match( /^[A-Z]/ ) ) return index;
    // Extract normalized text of custom entity and split on spaces and rejoin on vertical bar to form regex.
    const rgx = RegExp( e.out(its.normal).split( /\s+/ ).join( '|' ), 'i' );
    for ( let k = 0; k < ri.query.search.length; k += 1 ) {
      const riqsk = ri.query.search[ k ];
      if ( riqsk.title.match(rgx) || riqsk.snippet.match(rgx) )
          return { pageid: riqsk.pageid, title: riqsk.title }
    }
    return null;
}
  
async function searchAllTerms( terms ) {
    const allResults = [];
    for ( var i = 0; i < terms.length; i += 1 ) {
    //   Promise.delay(30); // Be nice to Wikipedia
      const r = await search( terms[ i ] );
      allResults.push( r );
    }
    return allResults;
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

search = async function ( term ) {
    const url = `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&list=search&srsearch=${term}`
    const response = await fetch(url); // d3.json
    await delay(30);
    if (!response.ok) {
        throw response.statusText;
    }

    return response.json();
}

let text = 'The early modern period began in the 16th century, when the Mughal Empire conquered most of the Indian subcontinent, signaling the proto-industrialisation, becoming the biggest global economy and manufacturing power. The Mughals suffered a gradual decline in the early 18th century, largely due to the rising power of the Marathas, who took control of extensive regions of the Indian subcontinent. The East India Company, acting as a sovereign force on behalf of the British government, gradually acquired control of huge areas of India between the middle of the 18th and the middle of the 19th centuries. Policies of company rule in India led to the Indian Rebellion of 1857. India was afterwards ruled directly by the British Crown, in the British Raj. After World War I, a nationwide struggle for independence was launched by the Indian National Congress, led by Mahatma Gandhi. Later, the All-India Muslim League would advocate for a separate Muslim-majority nation state. The British Indian Empire was partitioned in August 1947 into the Dominion of India and Dominion of Pakistan, each gaining its independence.';
// let text = `Apollo 11 was the spaceflight that first landed humans on the Moon. 
// Commander Neil Armstrong and lunar module pilot Buzz Aldrin formed the 
// American crew that landed the Apollo Lunar Module Eagle. The Lunar Module 
// or LM-5 Eagle was manufactured by Grumman Corporation, which later merged
// with Northrop Corporation in 1995 and became Northrop Grumman Corporation.`

let patterns = [
    {
      name: 'nounPhrase',
      patterns: [ '[PROPN] [|PROPN] [|PROPN] [|PROPN]' ]
    },
    {
      name: 'nounPhrase',
      patterns: [ '[PROPN] [ADJ|PROPN] [|PROPN] [|PROPN]' ]
    },
      {
      name: 'nounPhrase',
      patterns: [ '[PROPN|ADJ] [PROPN]' ]
    },
    {
      name: 'nounPhrase',
      patterns: [ '[PROPN] [CARDINAL]' ]
    },
    {
      name: 'simpleADJ',
      patterns: [ '[ADJ]' ]
    }
];

let patternCount = nlp.learnCustomEntities( patterns, { matchValue: false, useEntity: true, usePOS: true } );

async function getResult(){
    const wikiBaseUrl = 'https://en.wikipedia.org/wiki?';
    const doc = nlp.readDoc( text );
    const potentialEntities = doc.customEntities().out();
    console.log(potentialEntities);
    const results = await searchAllTerms( potentialEntities ); // return results;
    doc.customEntities().each( (e, i) => {
        const match = findBestMatch( results[ i ], e );
        if ( match !== null ) 
            e.markup();
    });
    console.log(doc.out(its.markedUpText));
}

getResult();