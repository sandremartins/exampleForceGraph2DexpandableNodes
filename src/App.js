import React, { useState, useMemo, useCallback, useEffect } from "react";
import { render } from "react-dom";
// import ForceGraph3D from 'react-force-graph-3d'; // Make sure to import ForceGraph3D
import { ForceGraph2D } from "react-force-graph";

// Assuming genRandomTree is defined somewhere
// function genRandomTree(N = 10, reverse = false) {
//   return {
//     nodes: [...Array(N).keys()].map((i) => ({ id: i })),
//     links: [...Array(N).keys()]
//       .filter((id) => id)
//       .map((id) => ({
//         [reverse ? "target" : "source"]: id,
//         [reverse ? "source" : "target"]: Math.round(Math.random() * (id - 1)),
//       })),
//   };
// }

function genRandomTree(N = 10, reverse = false) {
  return {
    "nodes": [
      {
        "id": 0,
        "label": "0",
        "collapsed": false,
        "childLinks": [
          {
            "source": 0,
            "target": 1
          },
          {
            "source": 0,
            "target": 4
          },
          {
            "source": 0,
            "target": 6
          },
          {
            "source": 0,
            "target": 7
          },
          {
            "source": 0,
            "target": 8
          }
        ]
      },
      {
        "id": 1,
        "label": "1",
        "childLinks": []
      },
      {
        "id": 2,
        "label": "2",
        "collapsed": true,
        "childLinks": []
      },
      {
        "id": 3,
        "label": "3",
        "collapsed": false,
        "childLinks": [
          {
            "source": 3,
            "target": 2
          }
        ]
      },
      {
        "id": 4,
        "label": "4",
        "collapsed": false,
        "childLinks": [
          {
            "source": 4,
            "target": 5
          }
        ]
      },
      {
        "id": 5,
        "label": "5",
        "collapsed": false,
        "childLinks": []
      },
      {
        "id": 6,
        "label": "6",
        "collapsed": true,
        "childLinks": []
      },
      {
        "id": 7,
        "label": "7",
        "collapsed": true,
        "childLinks": []
      },
      {
        "id": 8,
        "label": "8",
        "collapsed": true,
        "childLinks": []
      }
    ],
    "links": [
      {
        "source": 0,
        "target": 1
      },
      {
        "source": 3,
        "target": 2
      },
      {
        "source": 0,
        "target": 4
      },
      {
        "source": 4,
        "target": 5
      },
      {
        "source": 0,
        "target": 6
      },
      {
        "source": 0,
        "target": 7
      },
      {
        "source": 0,
        "target": 8
      }
    ]
  }
}

function App() {
  const rootId = 0;

  const ExpandableGraph = ({ graphData }) => {
    const nodesById = useMemo(() => {
      const nodesById = Object.fromEntries(
        graphData.nodes.map((node) => [node.id, node])
      );

      graphData.nodes.forEach((node) => {
        node.collapsed = node.id !== rootId;
        node.childLinks = [];
      });
      graphData.links.forEach((link) =>
        nodesById[link.source].childLinks.push(link)
      );

      return nodesById;
    }, [graphData]);

    const getPrunedTree = useCallback(() => {
      const visibleNodes = [];
      const visibleLinks = [];
    
      const traverseTree = (node) => {
        if (visibleNodes.includes(node)) return; // Avoid cycles
    
        visibleNodes.push(node);
    
        if (!node.collapsed) {
          visibleLinks.push(...node.childLinks);
          node.childLinks.forEach((link) => {
            const targetNode =
              typeof link.target === "object"
                ? link.target
                : nodesById[link.target];
    
            if (!targetNode.collapsed) {
              visibleNodes.push(targetNode);
              visibleLinks.push(link);
            }
          });
        }
      };
    
      graphData.nodes.forEach((node) => traverseTree(node));
    
      return { nodes: visibleNodes, links: visibleLinks };
    }, [graphData, nodesById]);
    
    
    
    

    const getPrunedTreep = useCallback(() => {
      const visibleNodes = [];
      const visibleLinks = [];

      (function traverseTree(node = nodesById[rootId]) {
        visibleNodes.push(node);
        if (node.collapsed) return;
        visibleLinks.push(...node.childLinks);
        node.childLinks
          .map((link) =>
            typeof link.target === "object"
              ? link.target
              : nodesById[link.target]
          )
          .forEach(traverseTree);
      })();

      return { nodes: visibleNodes, links: visibleLinks };
    }, [nodesById]);

    const [prunedTree, setPrunedTree] = useState(getPrunedTree());

    useEffect(() => {
      setPrunedTree(getPrunedTree());
    }, [getPrunedTree]);

    const handleNodeClick = useCallback(
      (node) => {
        node.collapsed = !node.collapsed;
        setPrunedTree(getPrunedTree());
      },
      [getPrunedTree]
    );

    return (
      <ForceGraph2D
        graphData={prunedTree}
        linkDirectionalParticles={2}
        nodeLabel='label'
        nodeColor={(node) =>
          !node.childLinks.length ? "green" : node.collapsed ? "red" : "yellow"
        }
        onNodeClick={handleNodeClick}
      />
    );
  };

  return <ExpandableGraph graphData={genRandomTree(10, true)} />;
}

export default App;
