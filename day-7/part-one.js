const fs = require('fs');
const readline = require('readline');
const { debug } = require('./debug');
const { DiGraph } = require('./digraph.js');

function parseRule(line) {
    const [source, dests] = line.split(' bags contain ');

    if (dests === 'no other bags.') {
        return {
            vertex: {
                name: source,
            },
            edges: []
        };
    } else {
        const destNodes = dests.substr(0, dests.length - 1).split(', ').map(dest => {
            const [num, ...name] = dest.substr(0, dest.indexOf('bag') - 1).split(' ');
            return {
                weight: Number.parseInt(num),
                source,
                dest: name.join(' ')
            }
        });

        return {
            vertex: {
                name: source
            },
            edges: destNodes
        };
    }
}

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        const readInterface = readline.createInterface({
            input: fs.createReadStream(filePath)
        });

        const graph = new DiGraph();

        readInterface.on('line', line => {
            const rule = parseRule(line);
            graph.addVertex(rule.vertex);
            rule.edges.forEach(edge => {
                graph.addEdge(edge)
            });
        });
        readInterface.on('close', () => {
            debug('done reading lines', graph);
            resolve(graph);
        })
    })
}

function solve(graph) {
    let sum = 0;
    const destVertexName = 'shiny gold';
    for (const [, vertex] of graph.vertexes) {
        if (vertex.name === destVertexName) {
            continue;
        }

        if (graph.pathExists(vertex.name, destVertexName)) {
            debug(vertex.name, 'can contain', destVertexName);
            sum++;
        }
    }

    const result = sum;

    return result;
}

module.exports = {
    readFile,
    solve
}