var _ = require('lodash')
  , q = require('q')
;

function quote(str) { return ['"',str,'"'].join(''); }

module.exports = {
  /**
   * The main entry point for the Dexter module
   *
   * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
   * @param {AppData} dexter Container for all data used in this workflow.
   */
  run: function(step, dexter) {
    var gambits = step.inputObject(['trigger', 'response', 'media'])
      , buffer  = []
      , media
    ;

    _.each(gambits, function(gambit) {
      //normalize to arrays
      if(!_.isArray(gambit.response)) gambit.response = [ gambit.response ];

      gambit.media = gambit.media || [];

      if(!_.isArray(gambit.media)) gambit.media = [ gambit.media ];

      buffer.push('+ ' + gambit.trigger);
      _.each(gambit.response, function(response, idx) {
        //get the corresponding media element
        media = gambit.media[idx];

        if(!media) 
          buffer.push('- ' + response);
        else
          buffer.push('- <call>with_media '+quote(media)+' '+quote(response)+'</call>');
      });
    });

    this.complete({ script: buffer.join("\n") });
  }
};
