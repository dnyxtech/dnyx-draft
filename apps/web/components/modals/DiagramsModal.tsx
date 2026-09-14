'use client';

import { ArrowLeft, Search, Shapes } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { ABCViewer } from '@/components/preview/diagrams/ABCViewer';
import { GeoMapViewer } from '@/components/preview/diagrams/GeoMapViewer';
import { KrokiViewer } from '@/components/preview/diagrams/KrokiViewer';
import { MarkmapViewer } from '@/components/preview/diagrams/MarkmapViewer';
import { STLViewer } from '@/components/preview/diagrams/STLViewer';
import { VegaLiteViewer } from '@/components/preview/diagrams/VegaLiteViewer';
import { MermaidViewer } from '@/components/preview/MermaidViewer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Engine =
  | 'mermaid'
  | 'markmap'
  | 'plantuml'
  | 'dot'
  | 'd2'
  | 'wavedrom'
  | 'vega-lite'
  | 'abc'
  | 'geojson'
  | 'topojson'
  | 'stl';

interface DiagramTemplate {
  id: string;
  category: string;
  name: string;
  engine: Engine;
  description: string;
  code: string;
}

const CATEGORY_ORDER = [
  'Flowcharts & Diagrams',
  'Mind Maps',
  'Data Visualization',
  'Technical Notation',
  '3D & Maps',
] as const;

const DIAGRAM_TEMPLATES: DiagramTemplate[] = [
  // Flowcharts & Diagrams — Mermaid, PlantUML, Graphviz, D2
  {
    id: 'mermaid-flowchart',
    category: 'Flowcharts & Diagrams',
    name: 'Flowchart',
    engine: 'mermaid',
    description: 'Directional flowchart with decisions',
    code: 'flowchart TD\n    A[Start] --> B{Decision?}\n    B -->|Yes| C[Process A]\n    B -->|No| D[Process B]\n    C --> E[End]\n    D --> E',
  },
  {
    id: 'mermaid-sequence',
    category: 'Flowcharts & Diagrams',
    name: 'Sequence Diagram',
    engine: 'mermaid',
    description: 'Message flow between actors',
    code: 'sequenceDiagram\n    participant Alice\n    participant Bob\n    Alice->>Bob: Hello Bob!\n    Bob-->>Alice: Hi Alice!\n    Alice->>Bob: How are you?\n    Bob-->>Alice: Great, thanks!',
  },
  {
    id: 'mermaid-class',
    category: 'Flowcharts & Diagrams',
    name: 'Class Diagram',
    engine: 'mermaid',
    description: 'UML class relationships',
    code: 'classDiagram\n    Animal <|-- Duck\n    Animal <|-- Fish\n    class Animal{\n        +String name\n        +makeSound()\n    }\n    class Duck{\n        +String color\n        +quack()\n    }',
  },
  {
    id: 'mermaid-er',
    category: 'Flowcharts & Diagrams',
    name: 'ER Diagram',
    engine: 'mermaid',
    description: 'Entity relationship diagram',
    code: 'erDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ LINE-ITEM : contains\n    CUSTOMER {\n        string name\n        string email\n    }\n    ORDER {\n        int id\n        date placed\n    }',
  },
  {
    id: 'mermaid-gantt',
    category: 'Flowcharts & Diagrams',
    name: 'Gantt Chart',
    engine: 'mermaid',
    description: 'Project timeline',
    code: 'gantt\n    title Project Timeline\n    dateFormat  YYYY-MM-DD\n    section Planning\n    Research :a1, 2024-01-01, 7d\n    Design   :a2, after a1, 5d\n    section Development\n    Coding   :b1, after a2, 14d\n    Testing  :b2, after b1, 7d',
  },
  {
    id: 'mermaid-pie',
    category: 'Flowcharts & Diagrams',
    name: 'Pie Chart',
    engine: 'mermaid',
    description: 'Proportional data chart',
    code: 'pie title Market Share\n    "Product A" : 45\n    "Product B" : 30\n    "Product C" : 25',
  },
  {
    id: 'plantuml-sequence',
    category: 'Flowcharts & Diagrams',
    name: 'PlantUML Sequence',
    engine: 'plantuml',
    description: 'PlantUML sequence diagram',
    code: '@startuml\nAlice -> Bob: Hello\nBob --> Alice: Hi there!\nAlice -> Bob: How are you?\nBob --> Alice: Fine, thanks!\n@enduml',
  },
  {
    id: 'plantuml-class',
    category: 'Flowcharts & Diagrams',
    name: 'PlantUML Class',
    engine: 'plantuml',
    description: 'PlantUML class diagram',
    code: '@startuml\nclass Animal {\n  +name: String\n  +makeSound()\n}\nclass Dog extends Animal {\n  +breed: String\n  +bark()\n}\n@enduml',
  },
  {
    id: 'graphviz-graph',
    category: 'Flowcharts & Diagrams',
    name: 'Graphviz Directed Graph',
    engine: 'dot',
    description: 'DOT language graph',
    code: 'digraph G {\n  rankdir=LR;\n  A -> B;\n  A -> C;\n  B -> D;\n  C -> D;\n  D -> E;\n}',
  },
  {
    id: 'd2-basic',
    category: 'Flowcharts & Diagrams',
    name: 'D2 Diagram',
    engine: 'd2',
    description: 'Modern diagram language',
    code: 'direction: right\nServer -> Database: queries\nClient -> Server: requests\nServer -> Client: responses',
  },
  // Mind Maps — Markmap
  {
    id: 'markmap-basic',
    category: 'Mind Maps',
    name: 'Markmap Tree',
    engine: 'markmap',
    description: 'Interactive mind map from Markdown',
    code: '# Central Topic\n## Branch 1\n- Item 1.1\n- Item 1.2\n  - Sub-item\n## Branch 2\n- Item 2.1\n- Item 2.2\n## Branch 3\n- Item 3.1',
  },
  {
    id: 'mermaid-mindmap',
    category: 'Mind Maps',
    name: 'Mermaid Mind Map',
    engine: 'mermaid',
    description: 'Hierarchical mind map',
    code: 'mindmap\n  root((Central Idea))\n    Branch A\n      Leaf A1\n      Leaf A2\n    Branch B\n      Leaf B1\n        Sub-leaf\n    Branch C',
  },
  // Data Visualization — Vega-Lite
  {
    id: 'vegalite-bar',
    category: 'Data Visualization',
    name: 'Bar Chart',
    engine: 'vega-lite',
    description: 'Interactive bar chart',
    code: '{\n  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",\n  "data": {"values": [\n    {"category": "A", "value": 28},\n    {"category": "B", "value": 55},\n    {"category": "C", "value": 43}\n  ]},\n  "mark": "bar",\n  "encoding": {\n    "x": {"field": "category", "type": "nominal"},\n    "y": {"field": "value", "type": "quantitative"}\n  }\n}',
  },
  {
    id: 'vegalite-line',
    category: 'Data Visualization',
    name: 'Line Chart',
    engine: 'vega-lite',
    description: 'Line chart over time',
    code: '{\n  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",\n  "data": {"values": [\n    {"x": 1, "y": 4},\n    {"x": 2, "y": 7},\n    {"x": 3, "y": 2},\n    {"x": 4, "y": 9},\n    {"x": 5, "y": 5}\n  ]},\n  "mark": "line",\n  "encoding": {\n    "x": {"field": "x", "type": "quantitative"},\n    "y": {"field": "y", "type": "quantitative"}\n  }\n}',
  },
  // Technical Notation — WaveDrom, ABC
  {
    id: 'wavedrom-timing',
    category: 'Technical Notation',
    name: 'Timing Diagram',
    engine: 'wavedrom',
    description: 'Digital waveform timing diagram',
    code: '{ signal: [\n  { name: "clk",  wave: "p.....|..." },\n  { name: "data", wave: "x.345x|=.x", data: ["A","B","C","D"] },\n  { name: "req",  wave: "0.1..0|1.0" },\n  {                              },\n  { name: "ack",  wave: "1.....|01." }\n]}',
  },
  {
    id: 'abc-melody',
    category: 'Technical Notation',
    name: 'ABC Melody',
    engine: 'abc',
    description: 'Music notation with playback',
    code: 'X:1\nT:Simple Melody\nM:4/4\nL:1/4\nK:C\nC D E F | G A B c | c B A G | F E D C |',
  },
  // 3D & Maps — STL, GeoJSON, TopoJSON
  {
    id: 'geojson-point',
    category: '3D & Maps',
    name: 'GeoJSON Point',
    engine: 'geojson',
    description: 'Geographic point on a map',
    code: '{\n  "type": "FeatureCollection",\n  "features": [{\n    "type": "Feature",\n    "geometry": {\n      "type": "Point",\n      "coordinates": [77.5946, 12.9716]\n    },\n    "properties": { "name": "Bangalore" }\n  }]\n}',
  },
  {
    id: 'stl-cube',
    category: '3D & Maps',
    name: 'STL 3D Model',
    engine: 'stl',
    description: 'Rotatable 3D model (paste your own STL data)',
    code: 'solid cube\n  facet normal 0 0 -1\n    outer loop\n      vertex 0 0 0\n      vertex 0 1 0\n      vertex 1 1 0\n    endloop\n  endfacet\n  facet normal 0 0 -1\n    outer loop\n      vertex 0 0 0\n      vertex 1 1 0\n      vertex 1 0 0\n    endloop\n  endfacet\nendsolid cube',
  },
];

const ENGINE_TO_FENCE: Record<Engine, string> = {
  mermaid: 'mermaid',
  markmap: 'markmap',
  plantuml: 'plantuml',
  dot: 'dot',
  d2: 'd2',
  wavedrom: 'wavedrom',
  'vega-lite': 'vega-lite',
  abc: 'abc',
  geojson: 'geojson',
  topojson: 'topojson',
  stl: 'stl',
};

function DiagramPreview({ engine, code }: { engine: Engine; code: string }) {
  switch (engine) {
    case 'mermaid':
      return <MermaidViewer chart={code} />;
    case 'markmap':
      return <MarkmapViewer source={code} />;
    case 'vega-lite':
      return <VegaLiteViewer spec={code} />;
    case 'abc':
      return <ABCViewer notation={code} />;
    case 'plantuml':
      return <KrokiViewer source={code} engine="plantuml" />;
    case 'dot':
      return <KrokiViewer source={code} engine="graphviz" />;
    case 'd2':
      return <KrokiViewer source={code} engine="d2" />;
    case 'wavedrom':
      return <KrokiViewer source={code} engine="wavedrom" />;
    case 'geojson':
      return <GeoMapViewer data={code} type="geojson" />;
    case 'topojson':
      return <GeoMapViewer data={code} type="topojson" />;
    case 'stl':
      return <STLViewer source={code} />;
    default:
      return null;
  }
}

interface DiagramsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (block: string) => void;
}

export const DiagramsModal: React.FC<DiagramsModalProps> = ({ open, onOpenChange, onInsert }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>(CATEGORY_ORDER[0]);
  const [selected, setSelected] = useState<DiagramTemplate | null>(null);
  const [code, setCode] = useState('');
  const [refTitle, setRefTitle] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [refLink, setRefLink] = useState('');

  const filtered = useMemo(() => {
    return DIAGRAM_TEMPLATES.filter((t) => {
      const matchesSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.engine.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = t.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const reset = () => {
    setSelected(null);
    setCode('');
    setRefTitle('');
    setRefNumber('');
    setRefLink('');
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handlePick = (tmpl: DiagramTemplate) => {
    setSelected(tmpl);
    setCode(tmpl.code);
  };

  const handleInsert = () => {
    if (!selected) return;
    const fenceLang = ENGINE_TO_FENCE[selected.engine];
    let block = `\n\n\`\`\`${fenceLang}\n${code}\n\`\`\`\n`;

    const captionParts: string[] = [];
    if (refNumber.trim()) captionParts.push(`Figure ${refNumber.trim()}`);
    if (refTitle.trim()) captionParts.push(refTitle.trim());
    let caption = captionParts.join(': ');
    if (refLink.trim()) {
      caption = caption
        ? `${caption} — [source](${refLink.trim()})`
        : `[source](${refLink.trim()})`;
    }
    if (caption) block += `\n*${caption}*\n`;

    onInsert(block);
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[880px] max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-slate-200 dark:border-slate-800 flex-row items-center gap-2 space-y-0">
          {selected && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 -ml-1"
              onClick={() => {
                setSelected(null);
                setCode('');
              }}
              title="Back to templates"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <DialogTitle className="text-base flex items-center gap-2">
            <Shapes className="h-4 w-4 text-violet-500" />
            {selected ? selected.name : 'Diagrams & More'}
          </DialogTitle>
        </DialogHeader>

        {!selected ? (
          <>
            <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-200 dark:border-slate-800">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search diagrams..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#090d16] text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-1 min-h-0">
              <div className="w-44 shrink-0 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-2 space-y-0.5">
                {CATEGORY_ORDER.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      category === cat
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {filtered.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-8">
                    No diagrams match your search.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filtered.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => handlePick(tmpl)}
                        className="text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 hover:bg-violet-50/50 dark:hover:bg-violet-950/30 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400">
                            {tmpl.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                            {tmpl.engine}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          {tmpl.description}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="diagram-code"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1"
                >
                  Code
                </label>
                <textarea
                  id="diagram-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={12}
                  spellCheck={false}
                  className="w-full px-3 py-2 text-xs font-mono rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#090d16] text-slate-800 dark:text-slate-200 outline-none focus:border-violet-500 resize-none"
                />
              </div>
              <div>
                <p className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Preview
                </p>
                <div className="h-[248px] rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-auto flex items-center justify-center p-2">
                  <DiagramPreview engine={selected.engine} code={code} />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Reference (optional)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="ref-number" className="block text-[10px] text-slate-400 mb-1">
                    Reference #
                  </label>
                  <input
                    id="ref-number"
                    type="text"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    placeholder="1"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#090d16] text-slate-800 dark:text-slate-200 outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label htmlFor="ref-title" className="block text-[10px] text-slate-400 mb-1">
                    Title
                  </label>
                  <input
                    id="ref-title"
                    type="text"
                    value={refTitle}
                    onChange={(e) => setRefTitle(e.target.value)}
                    placeholder="System architecture"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#090d16] text-slate-800 dark:text-slate-200 outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label htmlFor="ref-link" className="block text-[10px] text-slate-400 mb-1">
                    Reference Link
                  </label>
                  <input
                    id="ref-link"
                    type="url"
                    value={refLink}
                    onChange={(e) => setRefLink(e.target.value)}
                    placeholder="https://"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#090d16] text-slate-800 dark:text-slate-200 outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>

            <Button type="button" className="w-full" onClick={handleInsert}>
              Insert
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
