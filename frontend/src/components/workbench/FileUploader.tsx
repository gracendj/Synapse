"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, CheckCircle, AlertTriangle, ArrowRight, Edit3, FileText, Archive, PlusCircle, ChevronDown, ChevronRight, Check, XCircle, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { motion, AnimatePresence } from "framer-motion";
import { ExcelData } from "@/app/[locale]/workbench/page";

// --- PROPS AND INTERFACES (MODIFIED) ---

interface FileUploaderProps {
  onUpload: (data: ExcelData, name: string) => void;
  onError: (error: string) => void;
}

interface FileStatus {
  id: string;
  fileName: string;
  status: 'success' | 'failure';
  fileType: string; // NEW: To show which structure was detected
  sheetsFound: string[];
  sheetsMissing: string[];
  error?: string;
}

// --- NORMALIZATION AND CONFIGURATION (NEW & REFACTORED) ---

const SHEET_ALTERNATIVES: { [key: string]: string[] } = {
  "Abonné": ["Abonne", "Abonnés", "Abonnes", "Subscribers", "Subscriber"],
  "Listing": ["Listings", "Communications", "Calls", "Call_List"],
  "Listing Appel": ["Listing_Appel", "Call Listing"],
  "Listing SMS": ["Listing_SMS", "SMS Listing"],
  "IMEI partagé": ["IMEI partagé", "Shared IMEI"],
  "Fréquence par cellule": ["Frequence par cellule", "Cell Frequency", "Cellule"],
  "Fréquence Correspondant": ["Frequence Correspondant", "Correspondent Frequency"],
  "Fréquence par Durée appel": ["Frequence par Duree appel", "Call Duration Frequency"],
  "Fréquence par IMEI": ["Frequence par IMEI", "IMEI Frequency"],
  "Identification des abonnés": ["Identification des abonnes", "Subscriber Identification"],
};

const findSheetMatch = (sheetNames: string[], requiredSheet: string): string | null => {
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedRequired = normalize(requiredSheet);
    const exactMatch = sheetNames.find(name => normalize(name) === normalizedRequired);
    if (exactMatch) return exactMatch;
    const alternatives = SHEET_ALTERNATIVES[requiredSheet] || [];
    for (const alt of alternatives) {
        const foundAlt = sheetNames.find(name => normalize(name) === normalize(alt));
        if (foundAlt) return foundAlt;
    }
    return null;
};

// NEW: Normalization function for SMS data
const normalizeSmsData = (data: any[]): Record<string, unknown>[] => {
    return data.map(row => ({
        // Map SMS columns to the standard "Listing" column names
        // IMPORTANT: Adjust the target keys ('Numéro A', etc.) to match the exact headers of your standard "Listing" sheet.
        'Numéro A': row['Numéro émetteur'],
        'Numéro B': row['Numéro récepteur'],
        'Date': row['Date SMS'] instanceof Date ? (row['Date SMS'] as Date).toLocaleDateString() : row['Date SMS'],
        'Heure': row['Date SMS'] instanceof Date ? (row['Date SMS'] as Date).toLocaleTimeString() : '',
        'Localisation': row['Localisation numéro Destination (Longitude, Latitude)'],
        'IMEI': row['IMEI numéro récepteur'],
        // Add any other standard columns with default values if they don't exist in SMS data
        'Type': 'SMS', 
    }));
};

// NEW: Configuration for all supported file structures
const FILE_STRUCTURE_CONFIGS = [
    {
        id: 'TYPE_2_CALL_SMS',
        name: "Orange Listing ",
        detector: (sheetNames: string[]) => findSheetMatch(sheetNames, "Listing Appel") && findSheetMatch(sheetNames, "Listing SMS"),
        requiredSheets: ["Abonné", "Listing Appel", "Listing SMS", "Fréquence par cellule", "Fréquence Correspondant", "Fréquence par Durée appel", "Fréquence par IMEI", "Identification des abonnés"],
        sheetMappings: {
            subscribers: [{ sheetName: "Abonné" }],
            listings: [
                { sheetName: "Listing Appel" }, // No transformer needed, structure is standard
                { sheetName: "Listing SMS", transformer: normalizeSmsData } // Use the transformer for SMS data
            ]
        }
    },
    {
        id: 'TYPE_1_STANDARD',
        name: "MTN Listing",
        detector: (sheetNames: string[]) => !!findSheetMatch(sheetNames, "Listing"),
        requiredSheets: ["Abonné", "Listing", "Fréquence par cellule", "Fréquence Correspondant", "Fréquence par Durée appel", "Fréquence par IMEI", "Identification des abonnés"],
        sheetMappings: {
            subscribers: [{ sheetName: "Abonné" }],
            listings: [{ sheetName: "Listing" }]
        }
    },
    {
        id: 'TYPE_3_SHARED_IMEI',
        name: "IMEI Listing",
        detector: (sheetNames: string[]) => !!findSheetMatch(sheetNames, "Listing"),
        requiredSheets: ["Imei partagé", "Listing", "Fréquence par cellule", "Fréquence Correspondant", "Identification des abonnés"],
        sheetMappings: {
            // Note: Assuming "IMEI partagé" can be treated as subscribers data.
            // If it has a different structure, a transformer would be needed here too.
            subscribers: [{ sheetName: "Imei partagé" }],
            listings: [{ sheetName: "Listing" }]
        }
    }
];

// REFACTORED: The main parsing logic now detects and uses the correct configuration
// REFACTORED AND FIXED: The main parsing logic
const validateAndParseWorkbook = (workbook: XLSX.WorkBook): { data: ExcelData | null; missingSheets: string[], fileType: string } => {
    const sheetNames = workbook.SheetNames;

    // 1. Detect which file structure this workbook uses
    const config = FILE_STRUCTURE_CONFIGS.find(c => c.detector(sheetNames));

    // 2. Handle the case where the file structure is not recognized
    if (!config) {
        // THE FIX IS HERE:
        // The object being returned now correctly includes the 'missingSheets' property.
        // This guarantees that the calling function will not fail.
        return { data: null, missingSheets: ['File structure not recognized.'], fileType: 'Unknown Structure' };
    }

    // 3. Validate that all required sheets for the detected structure exist
    const missingSheets: string[] = [];
    const foundSheets: { [key: string]: string } = {};

    for (const requiredSheet of config.requiredSheets) {
        const match = findSheetMatch(sheetNames, requiredSheet);
        if (match) {
            foundSheets[requiredSheet] = match;
        } else {
            missingSheets.push(requiredSheet);
        }
    }

    if (missingSheets.length > 0) {
        return { data: null, missingSheets, fileType: config.name };
    }

    // 4. Parse and transform data according to the configuration
    const data: ExcelData = { subscribers: [], listings: [] };

    for (const [targetKey, mappings] of Object.entries(config.sheetMappings)) {
        for (const mapping of mappings as any[]) { // Using 'as any[]' to simplify looping
            const actualSheetName = foundSheets[mapping.sheetName];
            if (actualSheetName) {
                const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[actualSheetName], { defval: null, raw: false, blankrows: false });

                const processedData = mapping.transformer
                    ? mapping.transformer(sheetData)
                    : sheetData as Record<string, unknown>[];

                if (targetKey === 'subscribers' && data.subscribers) {
                    data.subscribers.push(...processedData);
                } else if (targetKey === 'listings' && data.listings) {
                    data.listings.push(...processedData);
                }
            }
        }
    }

    return { data, missingSheets: [], fileType: config.name };
};
/*
const validateAndParseWorkbook = (workbook: XLSX.WorkBook): { data: ExcelData | null; missingSheets: string[], fileType: string } => {
    const sheetNames = workbook.SheetNames;

    // 1. Detect which file structure this workbook uses
    const config = FILE_STRUCTURE_CONFIGS.find(c => c.detector(sheetNames));

    if (!config) {
        return { data: null, missingSheets: [], fileType: 'Unknown Structure' };
    }

    // 2. Validate that all required sheets for the detected structure exist
    const missingSheets: string[] = [];
    const foundSheets: { [key: string]: string } = {}; // Maps required name to actual found name

    for (const requiredSheet of config.requiredSheets) {
        const match = findSheetMatch(sheetNames, requiredSheet);
        if (match) {
            foundSheets[requiredSheet] = match;
        } else {
            missingSheets.push(requiredSheet);
        }
    }

    if (missingSheets.length > 0) {
        return { data: null, missingSheets, fileType: config.name };
    }

    // 3. Parse and transform data according to the configuration
    const data: ExcelData = { subscribers: [], listings: [] };

    for (const [targetKey, mappings] of Object.entries(config.sheetMappings)) {
        for (const mapping of mappings) {
            const actualSheetName = foundSheets[mapping.sheetName];
            if (actualSheetName) {
                const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[actualSheetName], { defval: null, raw: false, blankrows: false });
                
                const processedData = mapping.transformer 
                    ? mapping.transformer(sheetData) 
                    : sheetData as Record<string, unknown>[];

                if (targetKey === 'subscribers') {
                    data.subscribers.push(...processedData);
                } else if (targetKey === 'listings') {
                    data.listings.push(...processedData);
                }
            }
        }
    }

    return { data, missingSheets: [], fileType: config.name };
};
*/

// Original getWorkbooksFromFile function remains the same
const getWorkbooksFromFile = async (file: File): Promise<{name: string; workbook: XLSX.WorkBook; allSheetNames: string[]}[]> => {
    // ... no changes needed here
    const buffer = await file.arrayBuffer();
    if (file.name.toLowerCase().endsWith('.zip')) {
        const zip = await JSZip.loadAsync(buffer);
        const excelFilePromises: Promise<{name: string; workbook: XLSX.WorkBook; allSheetNames: string[]}>[] = [];
        zip.forEach((_, zipEntry) => {
            if (!zipEntry.dir && (zipEntry.name.endsWith('.xlsx') || zipEntry.name.endsWith('.xls'))) {
                const promise = zipEntry.async('arraybuffer').then(excelBuffer => {
                    const workbook = XLSX.read(excelBuffer, { type: "array", cellDates: true });
                    return { name: `${file.name} -> ${zipEntry.name}`, workbook, allSheetNames: workbook.SheetNames };
                });
                excelFilePromises.push(promise);
            }
        });
        const results = await Promise.all(excelFilePromises);
        if (results.length === 0) throw new Error(`No Excel files found in ZIP: ${file.name}`);
        return results;
    } else {
        const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
        return [{ name: file.name, workbook, allSheetNames: workbook.SheetNames }];
    }
};

// --- REACT COMPONENTS (With minor update to StatusItem) ---

const StatusItem: React.FC<{ status: FileStatus }> = ({ status }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isSuccess = status.status === 'success';
    return (
        <div className={`text-sm rounded-md border ${isSuccess ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="w-full flex items-center justify-between p-2 text-left">
                <div className="flex items-center gap-2 min-w-0">
                    {isSuccess ? <Check className="w-4 h-4 text-green-600 flex-shrink-0"/> : <XCircle className="w-4 h-4 text-red-600 flex-shrink-0"/>}
                    <span className="font-medium text-foreground truncate">{status.fileName}</span>
                </div>
                <div className="flex items-center gap-2">
                    {/* NEW: Display detected file type */}
                    <span className="px-2 py-0.5 rounded-full text-xs font-normal bg-blue-100 text-blue-800">{status.fileType}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isSuccess ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {isSuccess ? 'Success' : 'Failed'}
                    </span>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground"/> : <ChevronRight className="w-4 h-4 text-muted-foreground"/>}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-3 pt-1 border-t border-current/20">
                            <p className="font-semibold text-xs text-muted-foreground">Sheets Found:</p>
                            <p className="text-muted-foreground/80 text-xs break-all">{status.sheetsFound.join(', ') || 'None'}</p>
                            {!isSuccess && status.sheetsMissing.length > 0 && (
                                <>
                                    <p className="font-semibold text-xs text-red-600 mt-2">Required Sheets Missing:</p>
                                    <p className="text-red-600/90 text-xs break-all">{status.sheetsMissing.join(', ')}</p>
                                </>
                            )}
                            {status.error && (
                                 <p className="font-semibold text-xs text-red-600 mt-2">Error: {status.error}</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
};

export function FileUploader({ onUpload, onError }: FileUploaderProps) {
  // --- STATE AND HOOKS (REFACTORED processAllFiles) ---
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ExcelData | null>(null);
  const [analysisName, setAnalysisName] = useState("");

  const resetState = useCallback(() => {
    setUploadedFiles([]);
    setFileStatuses([]);
    setParsedData(null);
    setAnalysisName("");
    setIsProcessing(false);
  }, []);

  const processAllFiles = useCallback(async () => {
    if (uploadedFiles.length === 0) return;
    setIsProcessing(true);

    const combinedData: ExcelData = { subscribers: [], listings: [] };
    const newStatuses: FileStatus[] = [];

    await Promise.all(uploadedFiles.map(async (file) => {
        try {
            const workbooks = await getWorkbooksFromFile(file);
            for (const { name, workbook, allSheetNames } of workbooks) {
                // REFACTORED: Now receives fileType as well
                const { data, missingSheets, fileType } = validateAndParseWorkbook(workbook);
                if (data) {
                    newStatuses.push({ id: `${file.name}-${name}`, fileName: name, status: 'success', fileType, sheetsFound: allSheetNames, sheetsMissing: [] });
                    if (data.subscribers) combinedData.subscribers.push(...data.subscribers);
                    if (data.listings) combinedData.listings.push(...data.listings);
                } else {
                    newStatuses.push({ id: `${file.name}-${name}`, fileName: name, status: 'failure', fileType, sheetsFound: allSheetNames, sheetsMissing });
                }
            }
        } catch (e) {
            const error = e instanceof Error ? e.message : "An unknown error occurred.";
            newStatuses.push({ id: file.name, fileName: file.name, status: 'failure', fileType: 'Read Error', sheetsFound: [], sheetsMissing: [], error });
        }
    }));

    newStatuses.sort((a, b) => a.fileName.localeCompare(b.fileName));
    setFileStatuses(newStatuses);

    if (combinedData.listings && combinedData.listings.length > 0) {
        setParsedData(combinedData);
        if (!analysisName) setAnalysisName(`Analysis - ${new Date().toLocaleString()}`);
    } else {
        setParsedData(null);
        if(uploadedFiles.length > 0) {
           onError("No valid data could be extracted. Please check the file structures detailed below.");
        }
    }

    setIsProcessing(false);
  }, [uploadedFiles, analysisName, onError]);

  // The rest of the component (useEffect, onDrop, handleStartAnalysis, and render functions) remains the same.
  // ...
  useEffect(() => {
      processAllFiles();
  }, [uploadedFiles, processAllFiles]); 

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setUploadedFiles(prevFiles => {
        const existingFileNames = new Set(prevFiles.map(f => f.name));
        const newUniqueFiles = acceptedFiles.filter(f => !existingFileNames.has(f.name));
        return [...prevFiles, ...newUniqueFiles];
    });
  }, []);
  
  const handleStartAnalysis = () => {
    if (parsedData && analysisName.trim()) {
        onUpload(parsedData, analysisName.trim());
    }
  }
  
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/zip': ['.zip']
    },
    multiple: true,
    noKeyboard: true,
  });

  const renderWelcomeView = () => (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full transition-colors ${isDragActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}><Upload className="w-8 h-8" /></div>
            <div>
                <h3 className="text-lg font-semibold">{isDragActive ? "Drop the files here" : "Upload Your Data"}</h3>
                <p className="text-muted-foreground">Drag & drop or click to select .xlsx, .xls, or .zip files</p>
            </div>
        </div>
    </div>
  );

  const renderStagingView = () => (
    <div {...getRootProps({onClick: e => e.preventDefault()})} className="bg-muted/50 border border-border rounded-lg p-4 space-y-4 cursor-default">
        <input {...getInputProps()} />
        <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">Analysis Staging Area</h3>
            <button onClick={(e) => { e.stopPropagation(); resetState(); }} className="p-2 rounded-md hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto p-1">
            {fileStatuses.map((status) => <StatusItem key={status.id} status={status} />)}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-border">
            <button onClick={(e) => { e.stopPropagation(); open(); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-md border border-dashed bg-background hover:border-primary hover:text-primary transition-colors cursor-pointer">
                <PlusCircle className="w-4 h-4" /> Add More Files
            </button>
        </div>

        {parsedData && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-3 pt-4 border-t border-border">
                <label className="block text-sm font-medium text-foreground"><Edit3 className="w-4 h-4 inline mr-2" /> Name this Analysis</label>
                <input type="text" onClick={e => e.stopPropagation()} value={analysisName} onChange={(e) => setAnalysisName(e.target.value)} placeholder="e.g., Multi-Case Analysis" className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"/>
                <button onClick={(e) => { e.stopPropagation(); handleStartAnalysis(); }} disabled={!analysisName.trim() || isProcessing} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed">
                   {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin mr-2"/> Processing...</> : <>Start Analysis <ArrowRight className="w-4 h-4" /></>}
                </button>
            </motion.div>
        )}
    </div>
  );

  return (
    <div className="space-y-4">
        <AnimatePresence mode="wait">
            <motion.div key={uploadedFiles.length > 0 ? 'staging' : 'welcome'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {isProcessing && fileStatuses.length === 0 ? (
                    <div className="flex justify-center items-center h-48 border-2 border-dashed rounded-xl"><Loader2 className="w-8 h-8 animate-spin text-primary"/></div>
                ) : uploadedFiles.length > 0 ? (
                    renderStagingView()
                ) : (
                    renderWelcomeView()
                )}
            </motion.div>
        </AnimatePresence>
    </div>
  );
}