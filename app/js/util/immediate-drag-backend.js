// React-DnD backend that starts dragging immediately upon `touchstart` rather
// than waiting to detect movement.
//
// It is based on [longlho's touch backend](https://github.com/longlho/react-dnd/commit/368d49a4515f5cc3f4d6be7376074a6c0e699169)
// which itself claims to be basically
// https://github.com/gaearon/react-dnd/blob/ba8359ab3d7c76592357e078561d0e9d96afbcb0/src/backends/Touch.js
//

import { getEventClientOffset } from 'react-dnd/modules/utils/OffsetHelpers';
import invariant from 'invariant';
import getElementClientOffset from './offset';

class ImmediateDragBackend {
  constructor(manager) {
    this.actions = manager.getActions();
    this.monitor = manager.getMonitor();
    this.registry = manager.getRegistry();

    this.sourceNodes = {};
    this.sourceNodeOptions = {};
    this.sourcePreviewNodes = {};
    this.sourcePreviewNodeOptions = {};
    this.targetNodes = {};
    this.targetNodeOptions = {};

    this.getSourceClientOffset = this.getSourceClientOffset.bind(this);
    this.handleTopTouchStart = this.handleTopTouchStart.bind(this);
    this.handleTopMouseStart = this.handleTopMouseStart.bind(this);
    this.handleTopEventStart = this.handleTopEventStart.bind(this);
    this.handleTopEventStartCapture = this.handleTopEventStartCapture.bind(this);
    this.handleTopTouchMoveCapture = this.handleTopTouchMoveCapture.bind(this);
    this.handleTopMouseMoveCapture = this.handleTopMouseMoveCapture.bind(this);
    this.handleTopEventMoveCapture = this.handleTopEventMoveCapture.bind(this);
    this.handleTopEventEndCapture = this.handleTopEventEndCapture.bind(this);
  }

  setup() {
    if (typeof window === 'undefined') {
        return;
    }

    invariant(!this.constructor.isSetUp, 'Cannot have two ImmediateDragBackends at the same time.');
    this.constructor.isSetUp = true;

    window.addEventListener('touchstart', this.handleTopEventStartCapture, true);
    window.addEventListener('touchstart', this.handleTopTouchStart);
    window.addEventListener('touchmove', this.handleTopTouchMoveCapture, true);
    window.addEventListener('touchend', this.handleTopEventEndCapture, true);

    window.addEventListener('mousedown', this.handleTopEventStartCapture, true);
    window.addEventListener('mousedown', this.handleTopMouseStart);
    window.addEventListener('mousemove', this.handleTopMouseMoveCapture, true);
    window.addEventListener('mouseup', this.handleTopEventEndCapture, true);
  }

  teardown() {
    if (typeof window === 'undefined') {
        return;
    }

    this.constructor.isSetUp = false;

    window.removeEventListener('touchstart', this.handleTopEventStartCapture, true);
    window.removeEventListener('touchstart', this.handleTopEventStart);
    window.removeEventListener('touchmove', this.handleTopEventMoveCapture, true);
    window.removeEventListener('touchend', this.handleTopEventEndCapture, true);

    window.removeEventListener('mousedown', this.handleTopEventStartCapture, true);
    window.removeEventListener('mousedown', this.handleTopMouseStart);
    window.removeEventListener('mousemove', this.handleTopMouseMoveCapture, true);
    window.removeEventListener('mouseup', this.handleTopEventEndCapture, true);

    this.uninstallSourceNodeRemovalObserver();
  }

  connectDragSource(sourceId, node, options) {
    const handleEventStart = this.handleEventStart.bind(this, sourceId);
    this.sourceNodes[sourceId] = node;

    node.addEventListener('touchstart', handleEventStart);
    node.addEventListener('mousedown', handleEventStart);

    return () => {
      delete this.sourceNodes[sourceId];
      node.removeEventListener('touchstart', handleEventStart);
      node.removeEventListener('mousedown', handleEventStart);
    };
  }

  connectDragPreview(sourceId, node, options) {
    this.sourcePreviewNodeOptions[sourceId] = options;
    this.sourcePreviewNodes[sourceId] = node;

    return () => {
      delete this.sourcePreviewNodes[sourceId];
      delete this.sourcePreviewNodeOptions[sourceId];
    };
  }

  connectDropTarget(targetId, node) {
    this.targetNodes[targetId] = node;

    return () => {
      delete this.targetNodes[targetId];
    };
  }

  getSourceClientOffset(sourceId) {
    return getElementClientOffset(this.sourceNodes[sourceId]);
  }

  handleTopEventStartCapture(e) {
    this.eventStartSourceIds = [];
  }

  handleEventStart(sourceId) {
    this.eventStartSourceIds.unshift(sourceId);
  }

  handleTopTouchStart(e) {
    if (e.targetTouches.length !== 1) {
      return;
    }

    return this.handleTopEventStart(e, getEventClientOffset(e.targetTouches[0]));
  }

  handleTopMouseStart(e) {
    return this.handleTopEventStart(e, getEventClientOffset(e));
  }

  handleTopEventStart(e, clientOffset) {
    const { eventStartSourceIds } = this;

    // Don't prematurely preventDefault() here since it might:
    // 1. Mess up scrolling
    // 2. Mess up long tap (which brings up context menu)
    // 3. If there's an anchor link as a child, tap won't be triggered on link

    if (!this.monitor.isDragging() && eventStartSourceIds) {
      this.eventStartSourceIds = null;

      this.actions.beginDrag(eventStartSourceIds, {
        clientOffset,
        getSourceClientOffset: this.getSourceClientOffset,
        publishSource: false
      });
    }

    if (!this.monitor.isDragging()) {
      return;
    }

    const sourceNode = this.sourceNodes[this.monitor.getSourceId()];
    this.installSourceNodeRemovalObserver(sourceNode);
    this.actions.publishDragSource();

    e.preventDefault();
  }

  handleTopTouchMoveCapture(e) {
    if (e.targetTouches.length !== 1) {
        return;
    }
      
    return this.handleTopEventMoveCapture(e, getEventClientOffset(e.targetTouches[0]));
  }

  handleTopMouseMoveCapture(e) {
    return this.handleTopEventMoveCapture(e, getEventClientOffset(e)); 
  }

  handleTopEventMoveCapture(e, clientOffset) {
    if (!this.monitor.isDragging()) {
      return;
    }

    e.preventDefault();

    const matchingTargetIds = Object.keys(this.targetNodes)
      .filter((targetId) => {
        const boundingRect = this.targetNodes[targetId].getBoundingClientRect();
        return clientOffset.x >= boundingRect.left &&
          clientOffset.x <= boundingRect.right &&
          clientOffset.y >= boundingRect.top &&
          clientOffset.y <= boundingRect.bottom;
      });

    this.actions.hover(matchingTargetIds, { clientOffset });
  }

  handleTopEventEndCapture(e) {
    if (!this.monitor.isDragging() || this.monitor.didDrop()) {
      return;
    }

    e.preventDefault();


    this.uninstallSourceNodeRemovalObserver();
    this.actions.drop();
    this.actions.endDrag();
  }

  installSourceNodeRemovalObserver(node) {
    this.uninstallSourceNodeRemovalObserver();

    this.draggedSourceNode = node;
    this.draggedSourceNodeRemovalObserver = new window.MutationObserver(() => {
      if (!node.parentElement) {
        this.resurrectSourceNode();
        this.uninstallSourceNodeRemovalObserver();
      }
    });

    this.draggedSourceNodeRemovalObserver.observe(
      node.parentElement,
      { childList: true }
    );
  }

  resurrectSourceNode() {
    this.draggedSourceNode.style.display = 'none';
    this.draggedSourceNode.removeAttribute('data-reactid');
    document.body.appendChild(this.draggedSourceNode);
  }

  uninstallSourceNodeRemovalObserver() {
    if (this.draggedSourceNodeRemovalObserver) {
      this.draggedSourceNodeRemovalObserver.disconnect();
    }

    this.draggedSourceNodeRemovalObserver = null;
    this.draggedSourceNode = null;
  }
}

export default function createImmediateDragBackend(manager) {
  return new ImmediateDragBackend(manager);
}