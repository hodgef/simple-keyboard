import "./css/CandidateBox.css";
import Utilities from "../services/Utilities";
import { CandidateBoxParams, CandidateBoxRenderParams, CandidateBoxShowParams, KeyboardOptions } from "./../interfaces";
declare class CandidateBox {
    utilities: Utilities;
    options: KeyboardOptions;
    candidateBoxElement: HTMLDivElement;
    pageIndex: number;
    pageSize: number;
    constructor({ utilities, options }: CandidateBoxParams);
    destroy(): void;
    show({ candidateValue, targetElement, onSelect, }: CandidateBoxShowParams): void;
    renderPage({ candidateListPages, targetElement, pageIndex, nbPages, onItemSelected, }: CandidateBoxRenderParams): void;
}
export default CandidateBox;
