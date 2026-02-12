import { describe, it, expect, beforeEach } from 'vitest';
import { usePresentationStore } from './presentation-store';
import { PresentationStep } from '../graph/types';

// Helper to build minimal PresentationStep fixtures
const makeStep = (id: string): PresentationStep => ({
  id,
  title: `Step ${id}`,
  narration: `Narration for ${id}`,
  cameraPosition: { x: 0, y: 0, z: 100 },
  cameraTransitionMs: 1000,
  graphState: 'full-graph',
});

describe('usePresentationStore', () => {
  beforeEach(() => {
    // Reset to a known initial state before each test
    usePresentationStore.setState({
      mode: 'guided',
      currentStepIndex: 0,
      steps: [],
      isPlaying: false,
      isTransitioning: false,
    });
  });

  describe('nextStep', () => {
    it('increments currentStepIndex when not at last step', () => {
      usePresentationStore.setState({
        steps: [makeStep('1'), makeStep('2'), makeStep('3')],
        currentStepIndex: 0,
      });

      usePresentationStore.getState().nextStep();

      expect(usePresentationStore.getState().currentStepIndex).toBe(1);
    });

    it('sets isTransitioning to true when advancing', () => {
      usePresentationStore.setState({
        steps: [makeStep('1'), makeStep('2')],
        currentStepIndex: 0,
      });

      usePresentationStore.getState().nextStep();

      expect(usePresentationStore.getState().isTransitioning).toBe(true);
    });

    it('does not increment past last step', () => {
      usePresentationStore.setState({
        steps: [makeStep('1'), makeStep('2')],
        currentStepIndex: 1,
      });

      usePresentationStore.getState().nextStep();

      expect(usePresentationStore.getState().currentStepIndex).toBe(1);
    });

    it('does nothing when steps array is empty', () => {
      usePresentationStore.setState({ steps: [], currentStepIndex: 0 });

      usePresentationStore.getState().nextStep();

      expect(usePresentationStore.getState().currentStepIndex).toBe(0);
    });
  });

  describe('prevStep', () => {
    it('decrements currentStepIndex when not at first step', () => {
      usePresentationStore.setState({
        steps: [makeStep('1'), makeStep('2'), makeStep('3')],
        currentStepIndex: 2,
      });

      usePresentationStore.getState().prevStep();

      expect(usePresentationStore.getState().currentStepIndex).toBe(1);
    });

    it('does not decrement below 0', () => {
      usePresentationStore.setState({
        steps: [makeStep('1'), makeStep('2')],
        currentStepIndex: 0,
      });

      usePresentationStore.getState().prevStep();

      expect(usePresentationStore.getState().currentStepIndex).toBe(0);
    });
  });

  describe('goToStep', () => {
    it('sets index within bounds', () => {
      usePresentationStore.setState({
        steps: [makeStep('1'), makeStep('2'), makeStep('3')],
        currentStepIndex: 0,
      });

      usePresentationStore.getState().goToStep(2);

      expect(usePresentationStore.getState().currentStepIndex).toBe(2);
      expect(usePresentationStore.getState().isTransitioning).toBe(true);
    });

    it('ignores negative index', () => {
      usePresentationStore.setState({
        steps: [makeStep('1'), makeStep('2')],
        currentStepIndex: 1,
      });

      usePresentationStore.getState().goToStep(-1);

      expect(usePresentationStore.getState().currentStepIndex).toBe(1);
    });

    it('ignores out-of-bounds index', () => {
      usePresentationStore.setState({
        steps: [makeStep('1'), makeStep('2')],
        currentStepIndex: 0,
      });

      usePresentationStore.getState().goToStep(5);

      expect(usePresentationStore.getState().currentStepIndex).toBe(0);
    });
  });

  describe('toggleAutoPlay', () => {
    it('toggles isPlaying from false to true', () => {
      usePresentationStore.setState({ isPlaying: false });

      usePresentationStore.getState().toggleAutoPlay();

      expect(usePresentationStore.getState().isPlaying).toBe(true);
    });

    it('toggles isPlaying from true to false', () => {
      usePresentationStore.setState({ isPlaying: true });

      usePresentationStore.getState().toggleAutoPlay();

      expect(usePresentationStore.getState().isPlaying).toBe(false);
    });
  });

  describe('setMode', () => {
    it('resets currentStepIndex to 0 and isPlaying to false', () => {
      usePresentationStore.setState({
        mode: 'guided',
        currentStepIndex: 5,
        isPlaying: true,
        isTransitioning: true,
      });

      usePresentationStore.getState().setMode('explore');

      const state = usePresentationStore.getState();
      expect(state.mode).toBe('explore');
      expect(state.currentStepIndex).toBe(0);
      expect(state.isPlaying).toBe(false);
      expect(state.isTransitioning).toBe(false);
    });
  });

  describe('reset', () => {
    it('restores initial values (keeps mode and steps)', () => {
      usePresentationStore.setState({
        mode: 'campaign',
        currentStepIndex: 3,
        steps: [makeStep('1'), makeStep('2'), makeStep('3'), makeStep('4')],
        isPlaying: true,
        isTransitioning: true,
      });

      usePresentationStore.getState().reset();

      const state = usePresentationStore.getState();
      expect(state.currentStepIndex).toBe(0);
      expect(state.isPlaying).toBe(false);
      expect(state.isTransitioning).toBe(false);
      // reset does not change mode or steps
      expect(state.mode).toBe('campaign');
      expect(state.steps).toHaveLength(4);
    });
  });
});
