import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from "react";

export type Chapter = "compliance" | "automation" | "growth" | "operations";
export type Phase = "enter" | "heroPause" | "exit";

export interface ExperienceState {
  activeDiamondId: string | null; // e.g. "compliance"
  chapter: Chapter;
  phase: Phase;
}

type Action =
  | { type: "SET_ACTIVE"; id: string; chapter: Chapter }
  | { type: "SET_PHASE"; phase: Phase };

const initialState: ExperienceState = {
  activeDiamondId: null,
  chapter: "compliance",
  phase: "enter",
};

const ExperienceContext = createContext<[ExperienceState, Dispatch<Action>]>([
  initialState,
  () => {}
]);

export const ExperienceProvider = ({ children }: { children: ReactNode }) => {
  const reducer = (state: ExperienceState, action: Action): ExperienceState => {
    switch (action.type) {
      case "SET_ACTIVE":
        return { ...state, activeDiamondId: action.id, chapter: action.chapter };
      case "SET_PHASE":
        return { ...state, phase: action.phase };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ExperienceContext.Provider value={[state, dispatch]}>{children}</ExperienceContext.Provider>
  );
};

/** Hook to access the cinematic experience state and dispatch function.
 * Returns a tuple: [state, dispatch].
 */
export const useExperienceStore = () => useContext(ExperienceContext);
