import defaultSocket from "../../default-socket";
import MainScene from "../scenes/mainScene";

class Debugger {
    private _loaded = false;

    constructor(private scene: MainScene) {
        this.init();
    }

    init() {
        if (window.location.search === "?debug") {
            this._loaded = true;
            const dataStore = createDataStore();

            defaultSocket.on("update-entities", (payload) => {
                dataStore.updateStore(payload);
                const list = Object.keys(payload).map((id) => {
                    const unit = payload[id];
                    const name = unit.components.Name[0].value;

                    return {
                        name,
                        id,
                    };
                });

                fillUnitsList(list);

                if (dataStore.currentUnit) {
                    fillComponentsList(dataStore.getCharacterData(dataStore.currentUnit));
                    fillTags(dataStore.getCharacterData(dataStore.currentUnit));
                }
            });

            const toolContainer = document.createElement("div");
            const toolTitle = document.createElement("div");
            toolTitle.id = "tool-title";
            toolContainer.id = "tool-container";
            toolTitle.innerText = "Vue de Debug";

            const toolContent = document.createElement("div");
            toolContent.id = "tool-content";

            toolContainer.appendChild(toolTitle);
            toolContainer.appendChild(toolContent);
            document.body.appendChild(toolContainer);

            const unitsHeader = document.createElement("h3");
            unitsHeader.innerHTML = "UNITÉS";

            toolContent.appendChild(unitsHeader);

            const componentsHeader = document.createElement("h3");
            componentsHeader.innerHTML = "COMPOSANTS";
            toolContent.appendChild(componentsHeader);

            const tagsHeader = document.createElement("h3");
            tagsHeader.innerHTML = "TAGS";
            toolContent.appendChild(tagsHeader);

            const unitsList = document.createElement("div");
            unitsList.id = "units-list";
            toolContent.appendChild(unitsList);

            const componentsList = document.createElement("div");
            componentsList.id = "components-list";
            toolContent.appendChild(componentsList);

            const tagsList = document.createElement("div");
            tagsList.id = "tags-list";
            toolContent.appendChild(tagsList);


            const messagesHeader = document.createElement("h3");
            messagesHeader.innerHTML = "MESSAGES";
            toolContent.appendChild(messagesHeader);

            const messagesContainer = document.createElement("div");
            messagesContainer.id = "messages";
            toolContent.appendChild(messagesContainer);

            function createDataStore() {
                let dataStore: { [k: string]: any } = {};
                let currentUnit = "";

                return {
                    updateStore(payload: any) {
                        dataStore = payload;
                    },
                    getCharacterData(id: string) {
                        currentUnit = id;
                        return dataStore[id];
                    },
                    get currentUnit() {
                        return currentUnit
                    }
                }
            }

            function fillUnitsList(list: { name: string; id: string }[]) {
                unitsList.innerHTML = "";

                for (let unit of list) {
                    const unitButton = document.createElement("button");
                    unitButton.dataset.unitId = unit.id;
                    unitButton.innerHTML = unit.name;
                    unitButton.onclick = function () {
                        const activeHero = unitsList.getElementsByClassName("active")[0];
                        if (activeHero) {
                            activeHero.className = "";
                        }

                        unitButton.className = "active";
                        const data = dataStore.getCharacterData(unit.id);
                        fillComponentsList(data);
                        fillTags(data);
                    };

                    unitsList.appendChild(unitButton);
                }
            }

            function fillTags(unitData) {
                const { tags } = unitData;
                tagsList.innerHTML = "";
                for (let tag of tags) {
                    const tagDom = document.createElement("h2");
                    tagDom.style.color = "#000";
                    tagDom.style.fontSize = "26px";
                    tagDom.innerHTML = tag;
                    tagsList.appendChild(tagDom);
                }
            }

            function fillComponentsList(unitData) {
                const { components } = unitData;
                componentsList.innerHTML = "";
                for (let componentType in components) {
                    const componentTypeDOM = document.createElement("h2");
                    componentTypeDOM.style.color = "#000";
                    componentTypeDOM.style.fontSize = "26px";
                    const componentInstances = components[componentType];
                    const componentCount = componentInstances.length;
                    componentTypeDOM.innerHTML = `${componentType} (${componentCount})`;
                    const componentValueStrings = componentInstances.map((cmp) => {
                        const { type, ...rest } = cmp;
                        return JSON.stringify(rest);
                    });

                    componentsList.appendChild(componentTypeDOM);

                    const componentInstancesDiv = document.createElement("div");
                    componentInstancesDiv.style.display = "flex";
                    componentInstancesDiv.style.gap = "1rem";
                    componentInstancesDiv.style.flexWrap = "wrap";
                    componentInstancesDiv.style.marginBottom = "0.5rem";

                    for (let str of componentValueStrings) {
                        const fakeInput = document.createElement("input");
                        fakeInput.readOnly = true;
                        fakeInput.value = str;
                        componentInstancesDiv.appendChild(fakeInput);
                    }
                    componentsList.appendChild(componentInstancesDiv);
                }
            }

            // Make the DIV element draggable:
            dragElement(toolContainer);

            function dragElement(elmnt) {
                var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                elmnt.onmousedown = dragMouseDown;

                function dragMouseDown(e) {
                    e = e || window.event;
                    // get the mouse cursor position at startup:
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.onmouseup = closeDragElement;
                    // call a function whenever the cursor moves:
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    // calculate the new cursor position:
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    // set the element's new position:
                    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                }

                function closeDragElement() {
                    // stop moving when mouse button is released:
                    document.onmouseup = null;
                    document.onmousemove = null;
                }
            }
        }
    }

    logMessage(response: string[]) {
        if (this._loaded) {
            console.log(response);
        }
    }
};

export default Debugger;
