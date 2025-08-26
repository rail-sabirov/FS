// ==UserScript==
// @name         Arch: Transfer Counter (Refactored)
// @namespace    FiveStar
// @version      2025-08-21
// @description  Выводим общий счетчик переданных файлов в HHA
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

// Утилиты для работы с URL и ID
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

// Утилиты для работы с DOM
class DOMUtils {
    static addHeaderClass() {
        try {
            const header = document.querySelector('.fs-tab-area > header');
            if (header) {
                header.classList.add(CONFIG.headerClass);
            }
        } catch (error) {
            console.warn('Не удалось добавить класс к заголовку:', error);
        }
    }

    static createCounterElement(docs, transfered, isAll) {
        const div = document.createElement('div');
        div.classList.add(CONFIG.counterClass);
        
        if (isAll) {
            div.classList.add('fs-transfer-green');
            div.textContent = 'All';
            div.title = `Все документы переданы: ${docs}`;
        } else {
            div.textContent = `${docs} / ${transfered}`;
            div.title = `Документов: ${docs}, Передано: ${transfered}`;
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

// Работа с API и данными
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
            console.error('Ошибка при получении данных:', error);
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
                console.warn('Не указан ID caregiver для сохранения');
                return;
            }

            // Получаем существующие данные или создаем новый объект
            let allData = DataService.getAllLocalStorageData();
            
            // Очищаем данные других caregiver'ов, оставляем только текущий
            allData = {
                [caregiverId]: {
                    docs: data.docs,
                    transfered: data.transfered,
                    timestamp: Date.now()
                }
            };

            // Сохраняем обновленные данные
            localStorage.setItem(CONFIG.lsKeyName, JSON.stringify(allData));
            console.log(`Сохранены данные для caregiver ID: ${caregiverId}`);
        } catch (error) {
            console.error('Ошибка сохранения в localStorage:', error);
        }
    }

    static loadFromLocalStorage(caregiverId) {
        try {
            if (!caregiverId) {
                console.warn('Не указан ID caregiver для загрузки');
                return null;
            }

            const allData = DataService.getAllLocalStorageData();
            return allData[caregiverId] || null;
        } catch (error) {
            console.error('Ошибка загрузки из localStorage:', error);
            return null;
        }
    }

    static getAllLocalStorageData() {
        try {
            const data = localStorage.getItem(CONFIG.lsKeyName);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Ошибка получения всех данных из localStorage:', error);
            return {};
        }
    }
}

// Управление стилями
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

// Основной класс приложения
class TransferCounter {
    static async updateCounter() {
        try {
            const caregiverId = URLUtils.getCurrentCaregiverId();
            if (!caregiverId) {
                console.warn('Не удалось получить ID caregiver из URL');
                return null;
            }

            const url = DataService.getMainFolderUrl(caregiverId);
            const transferData = await DataService.fetchTransferData(url);
            
            // Сохраняем данные с ID caregiver'а
            DataService.saveToLocalStorage(transferData, caregiverId);
            
            // Создаем и вставляем счетчик
            const counterElement = DOMUtils.createCounterElement(
                transferData.docs, 
                transferData.transfered, 
                transferData.isAll
            );
            
            const inserted = DOMUtils.insertCounter(counterElement);
            if (!inserted) {
                console.warn('Не удалось вставить счетчик в DOM');
            }
            
            return transferData;
        } catch (error) {
            console.error('Ошибка обновления счетчика:', error);
            throw error;
        }
    }

    static async initializeCounter() {
        try {
            const caregiverId = URLUtils.getCurrentCaregiverId();
            if (!caregiverId) {
                console.warn('Не удалось получить ID caregiver из URL');
                return;
            }

            // Проверяем есть ли сохраненные данные для этого caregiver'а
            const savedData = DataService.loadFromLocalStorage(caregiverId);
            
            if (savedData) {
                console.log(`Найдены сохраненные данные для caregiver ID: ${caregiverId}`);
                
                // Отображаем сохраненные данные
                const counterElement = DOMUtils.createCounterElement(
                    savedData.docs,
                    savedData.transfered,
                    savedData.docs === savedData.transfered
                );
                
                const inserted = DOMUtils.insertCounter(counterElement);
                if (!inserted) {
                    console.warn('Не удалось вставить счетчик в DOM');
                }
            } else {
                console.log(`Данные для caregiver ID: ${caregiverId} не найдены, получаем через fetch`);
                
                // Получаем данные через fetch
                await this.updateCounter();
            }
        } catch (error) {
            console.error('Ошибка инициализации счетчика:', error);
        }
    }

    static async renewCounterFromLocalStorage() {
        try {
            const caregiverId = URLUtils.getCurrentCaregiverId();
            if (!caregiverId) {
                console.warn('Не удалось получить ID caregiver из URL');
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
            console.error('Ошибка обновления из localStorage:', error);
            return false;
        }
    }

    static setupFileUploadHandler() {
        const fileInput = document.getElementById('doc_file');
        if (fileInput) {
            fileInput.addEventListener('change', async function(event) {
                if (event.target.files && event.target.files.length > 0) {
                    console.log('Файл загружен, обновляем счетчик');
                    
                    const caregiverId = URLUtils.getCurrentCaregiverId();
                    if (!caregiverId) {
                        console.warn('Не удалось получить ID caregiver из URL');
                        return;
                    }
                    
                    // Увеличиваем количество docs в localStorage
                    const savedData = DataService.loadFromLocalStorage(caregiverId);
                    if (savedData) {
                        savedData.docs += 1;
                        DataService.saveToLocalStorage(savedData, caregiverId);
                        
                        // Обновляем отображение счетчика
                        await TransferCounter.renewCounterFromLocalStorage();
                    }
                }
            });
        } else {
            // Если элемент еще не загружен, попробуем позже
            setTimeout(() => TransferCounter.setupFileUploadHandler(), 1000);
        }
    }

    static setupFileDeleteHandler() {
        // Находим все формы удаления файлов
        const deleteForms = document.querySelectorAll('.fs-delete-file-form');
        
        deleteForms.forEach(form => {
            form.addEventListener('submit', async function(event) {
                console.log('Файл удален, обновляем счетчик');
                
                const caregiverId = URLUtils.getCurrentCaregiverId();
                if (!caregiverId) {
                    console.warn('Не удалось получить ID caregiver из URL');
                    return;
                }
                
                // Уменьшаем количество docs в localStorage
                const savedData = DataService.loadFromLocalStorage(caregiverId);
                if (savedData && savedData.docs > 0) {
                    savedData.docs -= 1;
                    DataService.saveToLocalStorage(savedData, caregiverId);
                    
                    // Обновляем отображение счетчика с небольшой задержкой
                    // чтобы дать время на обработку удаления
                    setTimeout(async () => {
                        await TransferCounter.renewCounterFromLocalStorage();
                    }, 500);
                }
            });
        });
        
        // Если формы еще не загружены, попробуем позже
        if (deleteForms.length === 0) {
            setTimeout(() => TransferCounter.setupFileDeleteHandler(), 1000);
        }
    }

    static setupTransferCheckboxHandler() {
        // Находим все чекбоксы для отметки переданных документов
        const transferCheckboxes = document.querySelectorAll('.transfer-checkbox');
        
        transferCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', async function(event) {
                console.log('Чекбокс изменен, обновляем счетчик transfered');
                
                const caregiverId = URLUtils.getCurrentCaregiverId();
                if (!caregiverId) {
                    console.warn('Не удалось получить ID caregiver из URL');
                    return;
                }
                
                // Изменяем количество transfered в localStorage
                const savedData = DataService.loadFromLocalStorage(caregiverId);
                if (savedData) {
                    if (event.target.checked) {
                        savedData.transfered += 1;
                    } else {
                        savedData.transfered = Math.max(0, savedData.transfered - 1);
                    }
                    DataService.saveToLocalStorage(savedData, caregiverId);
                    
                    // Обновляем отображение счетчика
                    await TransferCounter.renewCounterFromLocalStorage();
                }
            });
        });
        
        // Если чекбоксы еще не загружены, попробуем позже
        if (transferCheckboxes.length === 0) {
            setTimeout(() => TransferCounter.setupTransferCheckboxHandler(), 1000);
        }
    }

    static async initialize() {
        try {
            // Применяем стили
            StyleManager.applyStyles();
            
            // Добавляем класс к заголовку
            DOMUtils.addHeaderClass();
            
            // Инициализируем счетчик (проверяем localStorage или получаем данные через fetch)
            await this.initializeCounter();
            
            console.log('Transfer Counter инициализирован успешно');
        } catch (error) {
            console.error('Ошибка инициализации Transfer Counter:', error);
        }
    }
}



// Главный код без функций - запуск асинхронных функций
(async function main() {
    'use strict';
    
    // Ждем загрузки DOM если необходимо
    if (document.readyState === 'loading') {
        await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
        });
    }
    
    // Запускаем инициализацию
    await TransferCounter.initialize();
    
    // Настраиваем обработчики для файлов
    TransferCounter.setupFileUploadHandler();
    TransferCounter.setupFileDeleteHandler();
    
    // Настраиваем обработчик для чекбоксов переданных документов
    TransferCounter.setupTransferCheckboxHandler();
    
})().catch(error => {
    console.error('Критическая ошибка в main():', error);
});