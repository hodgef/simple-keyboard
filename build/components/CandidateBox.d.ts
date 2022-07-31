import "./css/CandidateBox.css";
import Utilities from "../services/Utilities";
import { CandidateBoxParams, CandidateBoxRenderParams, CandidateBoxShowParams } from "./../interfaces";
declare class CandidateBox {
    utilities: Utilities;
    candidateBoxElement: HTMLDivElement;
    pageIndex: number;
    pageSize: number;
    constructor({ utilities }: CandidateBoxParams);
    destroy(): void;
    show({ candidateValue, targetElement, onSelect, }: CandidateBoxShowParams): void;
    renderPage({ candidateListPages, targetElement, pageIndex, nbPages, onItemSelected, }: CandidateBoxRenderParams): void;
}
export default CandidateBox;
