import "./css/CandidateBox.css";

import Utilities from "../services/Utilities";
import {
  CandidateBoxParams,
  CandidateBoxRenderParams,
  CandidateBoxShowParams,
  KeyboardOptions,
} from "./../interfaces";

class CandidateBox {
  utilities: Utilities;
  options: KeyboardOptions;
  candidateBoxElement!: HTMLDivElement;
  pageIndex = 0;
  pageSize: number;

  constructor({ utilities, options }: CandidateBoxParams) {
    this.utilities = utilities;
    this.options = options;
    Utilities.bindMethods(CandidateBox, this);
    this.pageSize = this.utilities.getOptions().layoutCandidatesPageSize || 5;
  }

  destroy() {
    if (this.candidateBoxElement) {
      this.candidateBoxElement.remove();
      this.pageIndex = 0;
    }
  }

  show({
    candidateValue,
    targetElement,
    onSelect,
  }: CandidateBoxShowParams): void {
    if (!candidateValue || !candidateValue.length) {
      return;
    }

    const candidateListPages = this.utilities.chunkArray(
      candidateValue.split(" "),
      this.pageSize
    );

    this.renderPage({
      candidateListPages,
      targetElement,
      pageIndex: this.pageIndex,
      nbPages: candidateListPages.length,
      onItemSelected: (selectedCandidate: string, e: MouseEvent) => {
        onSelect(selectedCandidate, e);
        this.destroy();
      },
    });
  }

  renderPage({
    candidateListPages,
    targetElement,
    pageIndex,
    nbPages,
    onItemSelected,
  }: CandidateBoxRenderParams) {
    // Remove current candidate box, if any
    this.candidateBoxElement?.remove();

    // Create candidate box element
    this.candidateBoxElement = document.createElement("div");
    this.candidateBoxElement.className = "hg-candidate-box";

    // Candidate box list
    const candidateListULElement = document.createElement("ul");
    candidateListULElement.className = "hg-candidate-box-list";

    // Create Candidate box list items
    candidateListPages[pageIndex].forEach((candidateListItem) => {
      const candidateListLIElement = document.createElement("li");
      const getMouseEvent = () => {
        const mouseEvent = new (this.options.useTouchEvents ? TouchEvent : MouseEvent)("click");
        Object.defineProperty(mouseEvent, "target", {
          value: candidateListLIElement,
        });
        return mouseEvent;
      };

      candidateListLIElement.className = "hg-candidate-box-list-item";
      candidateListLIElement.innerHTML = this.options.display?.[candidateListItem] || candidateListItem;

      if(this.options.useTouchEvents) {
        candidateListLIElement.ontouchstart = (e: any) =>
          onItemSelected(candidateListItem, e || getMouseEvent());
      } else {
        candidateListLIElement.onclick = (e = getMouseEvent() as MouseEvent) =>
          onItemSelected(candidateListItem, e);
      }

      // Append list item to ul
      candidateListULElement.appendChild(candidateListLIElement);
    });

    // Add previous button
    const isPrevBtnElementActive = pageIndex > 0;
    const prevBtnElement = document.createElement("div");
    prevBtnElement.classList.add("hg-candidate-box-prev");
    isPrevBtnElementActive &&
      prevBtnElement.classList.add("hg-candidate-box-btn-active");

    const prevBtnElementClickAction = () => {
      if (!isPrevBtnElementActive) return;
      this.renderPage({
        candidateListPages,
        targetElement,
        pageIndex: pageIndex - 1,
        nbPages,
        onItemSelected,
      });
    };

    if(this.options.useTouchEvents) {
      prevBtnElement.ontouchstart = prevBtnElementClickAction;
    } else {
      prevBtnElement.onclick = prevBtnElementClickAction;
    }
    
    this.candidateBoxElement.appendChild(prevBtnElement);

    // Add elements to container
    this.candidateBoxElement.appendChild(candidateListULElement);

    // Add next button
    const isNextBtnElementActive = pageIndex < nbPages - 1;
    const nextBtnElement = document.createElement("div");
    nextBtnElement.classList.add("hg-candidate-box-next");
    isNextBtnElementActive &&
      nextBtnElement.classList.add("hg-candidate-box-btn-active");

    const nextBtnElementClickAction = () => {
      if (!isNextBtnElementActive) return;
      this.renderPage({
        candidateListPages,
        targetElement,
        pageIndex: pageIndex + 1,
        nbPages,
        onItemSelected,
      });
    };

    if(this.options.useTouchEvents) {
      nextBtnElement.ontouchstart = nextBtnElementClickAction;
    } else {
      nextBtnElement.onclick = nextBtnElementClickAction;
    }

    this.candidateBoxElement.appendChild(nextBtnElement);

    // Append candidate box to target element
    targetElement.prepend(this.candidateBoxElement);
  }
}

export default CandidateBox;
