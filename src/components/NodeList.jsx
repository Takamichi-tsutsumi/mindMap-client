import React, { Component } from 'react';
import axios from 'axios';

import NodeItem from './NodeItem.jsx';
import Speech from '../model/speech.js';

export class NodeList extends Component {

  constructor(props) {
      super(props)
      window.nodeList = this;

      this.state = { nodes: []};
      this.nodeItems = this.nodeItems.bind(this)
      Speech(this);
  }

  deleteSelected() {
      const nodes = this.state.nodes;
      if (nodes.length == 1) {
          this.setState({
              nodes: []
          })
      } else if ($.inArray(window.selected, this.state.node)){
          const updated_node = nodes;
          updated_node.splice(nodes.indexOf(window.selected),1)
          this.setState({
              nodes: updated_node
          })
      }
  }

  nodeItems() {
    if (this.state.nodes.length === 0) return () => {return ""};
    return this.state.nodes.map((nodeitem) => {
        return (
            <NodeItem
            className={ window.selected == nodeitem ? "selected" : "" }
            key={nodeitem}
            nodeitem={nodeitem}
            selected_change={
              () => {
                window.selected = nodeitem;
                this.forceUpdate()
              }
            }
             />
        )
    })
  }

  addWords(text) {
      if (text != "") {
          $.ajax({
              type: 'post',
              url: 'http://153.126.215.94/api/morphologic',
              data: JSON.stringify({ text: text }),
              dataType: 'json',
              contentType: 'application/json',
              success: function(response) {
                  const updated_nodes = this.state.nodes;
                  Array.forEach(response.keywords, function(word) {
                      if ($.inArray(word, updated_nodes) == -1) {
                          updated_nodes.splice(0, 0, word);
                      }
                  })
                  this.setState({
                      nodes: updated_nodes
                  })
              }.bind(this),
              error: function(response) {
                  console.log(response);
              }
          });
      }
  }

  render() {
    return(
      <ul>
        {this.nodeItems()}
      </ul>
    )
  }
}
