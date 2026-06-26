'use client';

/**
 * CatalogDispatch — routes a solved diagram figure to the right renderer.
 */

import React from 'react';
import NumberLineRenderer from './NumberLineRenderer';
import { EquationBalanceRenderer } from './EquationBalanceRenderer';
import { TapeDiagramRenderer } from './TapeDiagramRenderer';
import { FractionComparisonRenderer } from './FractionComparisonRenderer';
import { AreaModelRenderer } from './AreaModelRenderer';
import { PieChartRenderer } from './PieChartRenderer';
import { BarChartRenderer } from './BarChartRenderer';
import { LinePlotRenderer } from './LinePlotRenderer';
import { BalanceScaleRenderer } from './BalanceScaleRenderer';
import { LeverRenderer } from './LeverRenderer';
import { PulleySystemRenderer } from './PulleySystemRenderer';
import { InclinedPlaneRenderer } from './InclinedPlaneRenderer';
import { CatalogSpringMassRenderer } from './CatalogSpringMassRenderer';
import { CatalogPendulumRenderer } from './CatalogPendulumRenderer';
import { CatalogSimpleCircuitRenderer } from './CatalogSimpleCircuitRenderer';
import { CatalogWaveDiagramRenderer } from './CatalogWaveDiagramRenderer';
import { CatalogRayDiagramRenderer } from './CatalogRayDiagramRenderer';
import { CatalogVectorAdditionRenderer } from './CatalogVectorAdditionRenderer';
import { CatalogElectronConfigurationRenderer } from './CatalogElectronConfigurationRenderer';
import { CatalogOrbitalDiagramRenderer } from './CatalogOrbitalDiagramRenderer';
import { CatalogPeriodicTableHighlightRenderer } from './CatalogPeriodicTableHighlightRenderer';
import { CatalogPunnettSquareRenderer } from './CatalogPunnettSquareRenderer';
import { CatalogCycleStagesRenderer } from './CatalogCycleStagesRenderer';
import { CatalogBodySystemRenderer } from './CatalogBodySystemRenderer';
import {
  CatalogPhasesOfMoonRenderer,
  CatalogSolarSystemRenderer,
  CatalogEarthLayersRenderer,
  CatalogEclipseDiagramRenderer,
  CatalogSeasonsDiagramRenderer,
  CatalogPlateTectonicsRenderer,
} from './CatalogEarthSpaceRenderers';
import {
  CatalogFlowchartSimpleRenderer,
  CatalogStateMachineRenderer,
  CatalogBinaryTreeRenderer,
  CatalogTruthTableRenderer,
  CatalogLogicGateRenderer,
} from './CatalogCSRenderers';
import {
  CatalogUnitCircleRenderer,
  CatalogTransformationRenderer,
  CatalogInequalityGraphRenderer,
  CatalogSentenceDiagramRenderer,
  CatalogArgumentStructureRenderer,
  CatalogHistoricalTimelineRenderer,
  CatalogGovernmentBranchesRenderer,
  CatalogComparisonTableRenderer,
  CatalogOrganizerRenderer,
  CatalogHierarchyPyramidRenderer,
} from './CatalogAdvancedRenderers';
import { ProductionPossibilitiesRenderer } from './ProductionPossibilitiesRenderer';
import { BusinessCycleRenderer } from './BusinessCycleRenderer';
import { AdAsRenderer } from './AdAsRenderer';
import { MoneyMarketRenderer } from './MoneyMarketRenderer';
import { LoanableFundsRenderer } from './LoanableFundsRenderer';
import { PhillipsCurveRenderer } from './PhillipsCurveRenderer';
import { ForeignExchangeRenderer } from './ForeignExchangeRenderer';
import { RiemannSumRenderer } from './RiemannSumRenderer';
import { SlopeFieldRenderer } from './SlopeFieldRenderer';
import { ParametricCurveRenderer } from './ParametricCurveRenderer';
import { PolarGraphRenderer } from './PolarGraphRenderer';
import { TaylorOverlayRenderer } from './TaylorOverlayRenderer';
import { HistogramRenderer } from './HistogramRenderer';
import { NormalCurveRenderer } from './NormalCurveRenderer';
import { ScatterRegressionRenderer } from './ScatterRegressionRenderer';
import { PopulationPyramidRenderer } from './PopulationPyramidRenderer';
import { ClimateDiagramRenderer } from './ClimateDiagramRenderer';
import { CatalogNutrientCycleRenderer } from './CatalogNutrientCycleRenderer';
import { CatalogNeuronDiagramRenderer, CatalogBrainRegionsRenderer } from './CatalogAnatomyRenderers';
import { CatalogConicSectionsRenderer } from './CatalogConicSectionsRenderer';
import { CatalogSolidOfRevolutionRenderer } from './CatalogSolidOfRevolutionRenderer';

interface Props {
  kind: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  figure: any;
}

export function CatalogDispatch({ kind, figure }: Props) {
  switch (kind) {
    // Phase 1 — math K-8
    case 'number_line':              return <NumberLineRenderer {...figure} />;
    case 'equation_balance':         return <EquationBalanceRenderer figure={figure} />;
    case 'tape_diagram':             return <TapeDiagramRenderer figure={figure} />;
    case 'fraction_comparison':      return <FractionComparisonRenderer figure={figure} />;
    case 'area_model':               return <AreaModelRenderer figure={figure} />;
    case 'pie_chart':                return <PieChartRenderer figure={figure} />;
    case 'bar_chart':                return <BarChartRenderer figure={figure} />;
    case 'line_plot':                return <LinePlotRenderer figure={figure} />;
    // Phase 2 — physics
    case 'balance_scale':            return <BalanceScaleRenderer figure={figure} />;
    case 'lever':                    return <LeverRenderer figure={figure} />;
    case 'pulley_system':            return <PulleySystemRenderer figure={figure} />;
    case 'inclined_plane':           return <InclinedPlaneRenderer figure={figure} />;
    case 'spring_mass':              return <CatalogSpringMassRenderer figure={figure} />;
    case 'pendulum':                 return <CatalogPendulumRenderer figure={figure} />;
    case 'simple_circuit':           return <CatalogSimpleCircuitRenderer figure={figure} />;
    case 'wave_diagram':             return <CatalogWaveDiagramRenderer figure={figure} />;
    case 'ray_diagram_lens':
    case 'ray_diagram_mirror':       return <CatalogRayDiagramRenderer figure={figure} />;
    case 'vector_addition':          return <CatalogVectorAdditionRenderer figure={figure} />;
    // Phase 3 — chemistry / biology
    case 'electron_configuration':   return <CatalogElectronConfigurationRenderer figure={figure} />;
    case 'orbital_diagram':          return <CatalogOrbitalDiagramRenderer figure={figure} />;
    case 'periodic_table_highlight': return <CatalogPeriodicTableHighlightRenderer figure={figure} />;
    case 'punnett_square':           return <CatalogPunnettSquareRenderer figure={figure} />;
    case 'life_cycle':
    case 'water_cycle':
    case 'rock_cycle':               return <CatalogCycleStagesRenderer figure={figure} />;
    case 'body_system':              return <CatalogBodySystemRenderer figure={figure} />;
    // Phase 4 — earth / space
    case 'phases_of_moon':           return <CatalogPhasesOfMoonRenderer figure={figure} />;
    case 'solar_system':             return <CatalogSolarSystemRenderer figure={figure} />;
    case 'earth_layers':             return <CatalogEarthLayersRenderer figure={figure} />;
    case 'eclipse_diagram':          return <CatalogEclipseDiagramRenderer figure={figure} />;
    case 'seasons_diagram':          return <CatalogSeasonsDiagramRenderer figure={figure} />;
    case 'plate_tectonics':          return <CatalogPlateTectonicsRenderer figure={figure} />;
    // Phase 5 — CS
    case 'flowchart_simple':         return <CatalogFlowchartSimpleRenderer figure={figure} />;
    case 'state_machine':            return <CatalogStateMachineRenderer figure={figure} />;
    case 'binary_tree':              return <CatalogBinaryTreeRenderer figure={figure} />;
    case 'truth_table':              return <CatalogTruthTableRenderer figure={figure} />;
    case 'logic_gate':               return <CatalogLogicGateRenderer figure={figure} />;
    // Phase 6 — advanced math
    case 'unit_circle':              return <CatalogUnitCircleRenderer figure={figure} />;
    case 'transformation':           return <CatalogTransformationRenderer figure={figure} />;
    case 'inequality_graph':         return <CatalogInequalityGraphRenderer figure={figure} />;
    // Phase 7 — ELA / social
    case 'sentence_diagram':         return <CatalogSentenceDiagramRenderer figure={figure} />;
    case 'argument_structure':       return <CatalogArgumentStructureRenderer figure={figure} />;
    case 'historical_timeline':      return <CatalogHistoricalTimelineRenderer figure={figure} />;
    case 'government_branches':      return <CatalogGovernmentBranchesRenderer figure={figure} />;
    // Phase 8 — general organizers
    case 'comparison_table':         return <CatalogComparisonTableRenderer figure={figure} />;
    case 't_chart':
    case 'kwl_chart':
    case 'frayer_model':             return <CatalogOrganizerRenderer figure={figure} />;
    case 'hierarchy_pyramid':        return <CatalogHierarchyPyramidRenderer figure={figure} />;
    // Phase 9 — economics (AP Plans Initiative)
    case 'production_possibilities': return <ProductionPossibilitiesRenderer figure={figure} />;
    case 'business_cycle':           return <BusinessCycleRenderer figure={figure} />;
    case 'aggregate_demand_supply':  return <AdAsRenderer figure={figure} />;
    case 'money_market':             return <MoneyMarketRenderer figure={figure} />;
    case 'loanable_funds':           return <LoanableFundsRenderer figure={figure} />;
    case 'phillips_curve':           return <PhillipsCurveRenderer figure={figure} />;
    case 'foreign_exchange_market':  return <ForeignExchangeRenderer figure={figure} />;
    // Phase 10 — calculus (AP Calc BC)
    case 'riemann_sum':                return <RiemannSumRenderer figure={figure} />;
    case 'slope_field':                return <SlopeFieldRenderer figure={figure} />;
    case 'parametric_curve':           return <ParametricCurveRenderer figure={figure} />;
    case 'polar_graph':                return <PolarGraphRenderer figure={figure} />;
    case 'taylor_polynomial_overlay':  return <TaylorOverlayRenderer figure={figure} />;
    // Phase 11 — statistics (AP Statistics)
    case 'histogram':                  return <HistogramRenderer figure={figure} />;
    case 'normal_curve':               return <NormalCurveRenderer figure={figure} />;
    case 'scatterplot_regression':     return <ScatterRegressionRenderer figure={figure} />;
    // Phase 12 — environmental / demographic
    case 'population_pyramid':         return <PopulationPyramidRenderer figure={figure} />;
    case 'climate_diagram':            return <ClimateDiagramRenderer figure={figure} />;
    // Phase 13 — biogeochemical cycles + anatomy
    case 'nutrient_cycle':             return <CatalogNutrientCycleRenderer figure={figure} />;
    case 'neuron_diagram':             return <CatalogNeuronDiagramRenderer figure={figure} />;
    case 'brain_regions':              return <CatalogBrainRegionsRenderer figure={figure} />;
    // Phase 14 — conic sections
    case 'conic_sections':             return <CatalogConicSectionsRenderer figure={figure} />;
    // Phase 15 — 3D / spatial
    case 'solid_of_revolution':        return <CatalogSolidOfRevolutionRenderer figure={figure} />;

    default:
      return (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-center">
          <p className="text-sm text-amber-800">Diagram kind &quot;{kind}&quot; is in the catalog but the renderer is not yet wired.</p>
        </div>
      );
  }
}
