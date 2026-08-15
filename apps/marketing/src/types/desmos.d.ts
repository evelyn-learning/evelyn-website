/**
 * Desmos Graphing Calculator API Type Declarations
 * https://www.desmos.com/api/v1.11/docs/index.html
 */

declare namespace Desmos {
  interface ExpressionState {
    id: string;
    latex?: string;
    color?: string;
    hidden?: boolean;
    label?: string;
    showLabel?: boolean;
    lineStyle?: typeof Styles.SOLID | typeof Styles.DASHED | typeof Styles.DOTTED;
    lineWidth?: number;
    pointSize?: number;
    pointStyle?: typeof Styles.POINT | typeof Styles.OPEN | typeof Styles.CROSS;
    dragMode?: typeof DragModes.X | typeof DragModes.Y | typeof DragModes.XY | typeof DragModes.NONE;
  }

  interface MathBounds {
    left: number;
    right: number;
    bottom: number;
    top: number;
  }

  interface ScreenshotOptions {
    width?: number;
    height?: number;
    targetPixelRatio?: number;
    mode?: 'contain' | 'stretch' | 'preserveX' | 'preserveY';
  }

  interface CalculatorOptions {
    element?: HTMLElement;
    expressions?: boolean;
    settingsMenu?: boolean;
    zoomButtons?: boolean;
    lockViewport?: boolean;
    border?: boolean;
    keypad?: boolean;
    expressionsTopbar?: boolean;
    links?: boolean;
    images?: boolean;
    folders?: boolean;
    notes?: boolean;
    sliders?: boolean;
    qwertyKeyboard?: boolean;
    restrictedFunctions?: boolean;
    pasteGraphLink?: boolean;
    pasteTableData?: boolean;
    clearIntoDegreeMode?: boolean;
    colors?: Record<string, string>;
    autosize?: boolean;
    plotSingleVariableImplicitEquations?: boolean;
    plotImplicits?: boolean;
    plotInequalities?: boolean;
    projectorMode?: boolean;
    invertedColors?: boolean;
    fontSize?: number;
    language?: string;
    brailleMode?: string;
    sixKeyInput?: boolean;
    graphpaper?: boolean;
    administerSecretFolders?: boolean;
    decimalToFraction?: boolean;
  }

  interface Calculator {
    setExpression(expr: ExpressionState): void;
    removeExpression(expr: { id: string }): void;
    setExpressions(exprs: ExpressionState[]): void;
    getExpressions(): ExpressionState[];
    setMathBounds(bounds: MathBounds): void;
    getMathBounds(): MathBounds;
    screenshot(opts?: ScreenshotOptions): string;
    asyncScreenshot(opts: ScreenshotOptions, callback: (dataUrl: string) => void): void;
    destroy(): void;
    resize(): void;
    getState(): unknown;
    setState(state: unknown): void;
    observeEvent(eventName: string, callback: () => void): void;
    unobserveEvent(eventName: string): void;
    setBlank(): void;
    HelperExpression(opts: { latex: string }): { observe: (event: string, cb: () => void) => void; numericValue: number; unobserve: (event: string) => void };
    updateSettings(settings: Partial<CalculatorOptions>): void;
  }

  const Styles: {
    SOLID: 'SOLID';
    DASHED: 'DASHED';
    DOTTED: 'DOTTED';
    POINT: 'POINT';
    OPEN: 'OPEN';
    CROSS: 'CROSS';
  };

  const DragModes: {
    X: 'X';
    Y: 'Y';
    XY: 'XY';
    NONE: 'NONE';
  };

  const Colors: Record<string, string>;

  function GraphingCalculator(element: HTMLElement, options?: Partial<CalculatorOptions>): Calculator;
}

interface Window {
  Desmos?: typeof Desmos;
}
