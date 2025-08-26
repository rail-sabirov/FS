// ==UserScript==
// @name         Arch: Transfer Counter (Refactored)
// @namespace    FiveStar
// @version      2025-08-21
// @description  Display total counter of transferred files in HHA
// @author       Rail-S
// @match        https://fivestararchive.com/index.php?r=caregiver%2Fview*
// @match        https://fivestararchive.com/index.php?r=caregiver/view*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fivestarhomecareny.com
// @grant        none
// ==/UserScript==

const CONFIG = {
    lsKeyName: 'fs-transfer-counter',
    counterClass: 'fs-transfer-counter',
    headerClass: 'fs-doc-panel-header'
};

// Utilities for working with URL and ID
class URLUtils {
    static _caregiverId = null;
    
    static getCurrentCaregiverId() {
        if (this._caregiverId === null) {
            const url = new URL(window.location);
            this._caregiverId = url.searchParams.get('id') || null;
        }
        return this._caregiverId;
    }
}

// Utilities for working with DOM
class DOMUtils {
    static addHeaderClass() {
        try {
            const header = document.querySelector('.fs-tab-area > header');
            if (header) {
                header.classList.add(CONFIG.headerClass);
            }
        } catch (error) {
            console.warn('Failed to add class to header:', error);
        }
    }

    static createCounterElement(docs, transfered, isAll) {
        const div = document.createElement('div');
        div.classList.add(CONFIG.counterClass);
        
        if (isAll) {
            div.classList.add('fs-transfer-green');
            div.textContent = 'All';
            div.title = `All documents transferred: ${docs}`;
        } else {
            div.textContent = `${docs} / ${transfered}`;
            div.title = `Documents: ${docs}, Transferred: ${transfered}`;
        }
        
        return div;
    }

    static insertCounter(counterElement) {
        const container = document.querySelector(`.${CONFIG.headerClass}`);
        if (container) {
            container.prepend(counterElement);
            return true;
        }
        return false;
    }
}

// Working with API and data
class DataService {
    static async fetchTransferData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            
            const docs = doc.querySelectorAll('.transfer-checkbox').length;
            const transfered = doc.querySelectorAll('.transfer-checkbox:checked').length;

            return {
                docs,
                transfered,
                isAll: docs === transfered
            };
        } catch (error) {
            console.error('Error fetching data:', error);
            return {
                docs: 0,
                transfered: 0,
                isAll: false
            };
        }
    }

    static getMainFolderUrl(caregiverId) {
        return `https://fivestararchive.com/index.php?r=caregiver%2Fview&id=${caregiverId || 0}`;
    }

    static saveToLocalStorage(data, caregiverId) {
        try {
            if (!caregiverId) {
                console.warn('Caregiver ID not specified for saving');
                return;
            }

            // Get existing data or create new object
            let allData = DataService.getAllLocalStorageData();
            
            // Clear data of other caregivers, keep only current one
            allData = {
                [caregiverId]: {
                    docs: data.docs,
                    transfered: data.transfered,
                    timestamp: Date.now()
                }
            };

            // Save updated data
            localStorage.setItem(CONFIG.lsKeyName, JSON.stringify(allData));
            console.log(`Data saved for caregiver ID: ${caregiverId}`);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    static loadFromLocalStorage(caregiverId) {
        try {
            if (!caregiverId) {
                console.warn('Caregiver ID not specified for loading');
                return null;
            }

            const allData = DataService.getAllLocalStorageData();
            return allData[caregiverId] || null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    static getAllLocalStorageData() {
        try {
            const data = localStorage.getItem(CONFIG.lsKeyName);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error getting all data from localStorage:', error);
            return {};
        }
    }
}

// Style management
class StyleManager {
    static applyStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .${CONFIG.counterClass} {
                font-size: 80%;
                background-color: #FFC107;
                color: #3d3d3d;
                padding: 0px 10px;
                line-height: 22px;
                position: absolute;
                height: 25px;
                border-radius: 4px;
                font-weight: bold;
                top: 14px;
                left: -82px;
                border: 2px solid #ffd864;
            }

            .${CONFIG.counterClass}.fs-transfer-green {
                background-color: #4caf50;
                color: #ffffff;
                border-color: #c8dfad;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// Main application class
class TransferCounter {
    static async updateCounter() {
        try {
            const caregiverId = URLUtils.getCurrentCaregiverId();
            if (!caregiverId) {
                console.warn('Failed to get caregiver ID from URL');
                return null;
            }

            const url = DataService.getMainFolderUrl(caregiverId);
            const transferData = await DataService.fetchTransferData(url);
            
            // Save data with caregiver ID
            DataService.saveToLocalStorage(transferData, caregiverId);
            
            // Create and insert counter
            const counterElement = DOMUtils.createCounterElement(
                transferData.docs, 
                transferData.transfered, 
                transferData.isAll
            );
            
            const inserted = DOMUtils.insertCounter(counterElement);
            if (!inserted) {
                console.warn('Failed to insert counter into DOM');
            }
            
            return transferData;
        } catch (error) {
            console.error('Error updating counter:', error);
            throw error;
        }
    }

    static async initializeCounter() {
        try {
            const caregiverId = URLUtils.getCurrentCaregiverId();
            if (!caregiverId) {
                console.warn('Failed to get caregiver ID from URL');
                return;
            }

            // Check if there is saved data for this caregiver
            const savedData = DataService.loadFromLocalStorage(caregiverId);
            
            if (savedData) {
                console.log(`Found saved data for caregiver ID: ${caregiverId}`);
                
                // Display saved data
                const counterElement = DOMUtils.createCounterElement(
                    savedData.docs,
                    savedData.transfered,
                    savedData.docs === savedData.transfered
                );
                
                const inserted = DOMUtils.insertCounter(counterElement);
                if (!inserted) {
                    console.warn('Failed to insert counter into DOM');
                }
            } else {
                console.log(`Data for caregiver ID: ${caregiverId} not found, fetching via API`);
                
                // Get data via fetch
                await this.updateCounter();
            }
        } catch (error) {
            console.error('Error initializing counter:', error);
        }
    }

    static async renewCounterFromLocalStorage() {
        try {
            const caregiverId = URLUtils.getCurrentCaregiverId();
            if (!caregiverId) {
                console.warn('Failed to get caregiver ID from URL');
                return false;
            }

            const savedData = DataService.loadFromLocalStorage(caregiverId);
            if (!savedData) {
                return false;
            }

            const counterElement = document.querySelector(`.${CONFIG.counterClass}`);
            if (counterElement) {
                const isAll = savedData.docs === savedData.transfered;
                if (isAll) {
                    counterElement.textContent = 'All';
                    counterElement.classList.add('fs-transfer-green');
                } else {
                    counterElement.textContent = `${savedData.docs} / ${savedData.transfered}`;
                    counterElement.classList.remove('fs-transfer-green');
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating from localStorage:', error);
            return false;
        }
    }

    static setupFileUploadHandler() {
        const fileInput = document.getElementById('doc_file');
        if (fileInput) {
            fileInput.addEventListener('change', async function(event) {
                if (event.target.files && event.target.files.length > 0) {
                    console.log('File uploaded, updating counter');
                    
                    const caregiverId = URLUtils.getCurrentCaregiverId();
                    if (!caregiverId) {
                        console.warn('Failed to get caregiver ID from URL');
                        return;
                    }
                    
                    // Increase docs count in localStorage
                    const savedData = DataService.loadFromLocalStorage(caregiverId);
                    if (savedData) {
                        savedData.docs += 1;
                        DataService.saveToLocalStorage(savedData, caregiverId);
                        
                        // Update counter display
                        await TransferCounter.renewCounterFromLocalStorage();
                    }
                }
            });
        } else {
            // If element is not loaded yet, try again later
            setTimeout(() => TransferCounter.setupFileUploadHandler(), 1000);
        }
    }

    static setupFileDeleteHandler() {
        // Find all file deletion forms
        const deleteForms = document.querySelectorAll('.fs-delete-file-form');
        
        deleteForms.forEach(form => {
            form.addEventListener('submit', async function(event) {
                console.log('File deleted, updating counter');
                
                const caregiverId = URLUtils.getCurrentCaregiverId();
                if (!caregiverId) {
                    console.warn('Failed to get caregiver ID from URL');
                    return;
                }
                
                // Decrease docs count in localStorage
                const savedData = DataService.loadFromLocalStorage(caregiverId);
                if (savedData && savedData.docs > 0) {
                    savedData.docs -= 1;
                    DataService.saveToLocalStorage(savedData, caregiverId);
                    
                    // Update counter display with small delay
                 // to give time for deletion processing
                    setTimeout(async () => {
                        await TransferCounter.renewCounterFromLocalStorage();
                    }, 500);
                }
            });
        });
        
        // If forms are not loaded yet, try again later
        if (deleteForms.length === 0) {
            setTimeout(() => TransferCounter.setupFileDeleteHandler(), 1000);
        }
    }

    static setupTransferCheckboxHandler() {
        // Find all checkboxes for marking transferred documents
        const transferCheckboxes = document.querySelectorAll('.transfer-checkbox');
        
        transferCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', async function(event) {
                console.log('Checkbox changed, updating transferred counter');
                
                const caregiverId = URLUtils.getCurrentCaregiverId();
                if (!caregiverId) {
                    console.warn('Failed to get caregiver ID from URL');
                    return;
                }
                
                // Change transferred count in localStorage
                const savedData = DataService.loadFromLocalStorage(caregiverId);
                if (savedData) {
                    if (event.target.checked) {
                        savedData.transfered += 1;
                    } else {
                        savedData.transfered = Math.max(0, savedData.transfered - 1);
                    }
                    DataService.saveToLocalStorage(savedData, caregiverId);
                    
                    // Update counter display
                    await TransferCounter.renewCounterFromLocalStorage();
                }
            });
        });
        
        // If checkboxes are not loaded yet, try again later
        if (transferCheckboxes.length === 0) {
            setTimeout(() => TransferCounter.setupTransferCheckboxHandler(), 1000);
        }
    }

    static async initialize() {
        try {
            // Apply styles
            StyleManager.applyStyles();
            
            // Add class to header
            DOMUtils.addHeaderClass();
            
            // Initialize counter (check localStorage or fetch data via API)
            await this.initializeCounter();
            
            console.log('Transfer Counter initialized successfully');
        } catch (error) {
            console.error('Error initializing Transfer Counter:', error);
        }
    }
}



// Main code without functions - launching asynchronous functions
(async function main() {
    'use strict';
    
    // Wait for DOM loading if necessary
    if (document.readyState === 'loading') {
        await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
        });
    }
    
    // Start initialization
    await TransferCounter.initialize();
    
    // Set up file handlers
    TransferCounter.setupFileUploadHandler();
    TransferCounter.setupFileDeleteHandler();
    
    // Set up handler for transferred documents checkboxes
    TransferCounter.setupTransferCheckboxHandler();
    
})().catch(error => {
    console.error('Critical error in main():', error);
});