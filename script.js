

var botao = document.getElementById('botao'); //Importar (JSON)
var botao2 = document.getElementById('botao2'); //Exportar (JSON)
var botao3 = document.getElementById('botao3'); //Clear Storage


const clearStorage = async () => {
	try {
		await chrome.storage.local.clear();
		console.log('Storage limpo com sucesso');
		return true;
	} catch (error) {
		console.error('Erro ao limpar storage:', error);
		return false;
	}
};


const saveToStorage = async (key, data) => {
    
    try {
        await chrome.storage.local.set({ [key]: JSON.stringify(data) });
        console.log('Dados salvos com sucesso:', key);
        return true;
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        return false;
    }
};

const getFromStorage = async (key) => {
    try {
        const result = await chrome.storage.local.get([key]);
        if (result[key]) {
            return JSON.parse(result[key]);
        }
        return null;
    } catch (error) {
        console.error('Erro ao recuperar dados:', error);
        return null;
    }
};

// Função auxiliar para fazer download de um arquivo
function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Função auxiliar para ler o conteúdo de um arquivo
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
}

async function getStorageKeys() {
    try {
        const result = await chrome.storage.local.get(null);
        return Object.keys(result);
    } catch (error) {
        console.error('Erro ao obter chaves do storage:', error);
        return [];
    }
}


// Função para exportar todo o conteúdo do Chrome Storage
async function exportStorage() {
    try {
        const storageData = {};
        
        // Obter todas as chaves do storage
        const keys = await getStorageKeys();
        
        // Iterar pelas chaves e obter os valores
        for (const key of keys) {
            const data = await getFromStorage(key);
            storageData[key] = data;
        }
        
        // Converter para JSON e fazer o download
        const jsonData = JSON.stringify(storageData, null, 2);
        downloadFile('chrome-storage-backup.json', jsonData);
        
        console.log('Exportação concluída!');
        return true;
    } catch (error) {
        console.error('Erro ao exportar o storage:', error);
        return false;
    }
}

window.onload = async function executar() {}

async function selectFile() {
    return new Promise((resolve) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.addEventListener('change', () => {
            resolve(fileInput.files[0]);
        });
        fileInput.click();
    });
}

async function importStorage(file) {
    try {
        // Ler o conteúdo do arquivo
        const jsonData = await readFileAsText(file);
        const storageData = JSON.parse(jsonData);
        
        // Limpar o storage atual
        await clearStorage();
        
        // Salvar os dados do arquivo no storage
        for (const [key, data] of Object.entries(storageData)) {
            await saveToStorage(key, data);
        }
        
        console.log('Importação concluída!');
        return true;
    } catch (error) {
        console.error('Erro ao importar o storage:', error);
        return false;
    }
}

botao2.onclick = async function() {                
	var result = await exportStorage();

	if (result) {
		alert('Storage exported successfully');
	}
};

botao3.onclick = async function() {                
	

	var confirmacao = confirm("Are you sure you want to clear the storage?");

	if (confirmacao) {
		var resultado = await clearStorage();
		if (resultado) {
			alert('Storage cleared successfully');
		} else {
			alert('Error clearing storage');
		}
	}
};

botao.onclick = async function() {                
	const file = await selectFile();
    if (file) {
        var result = await importStorage(file);

		if (result) {
			alert('Storage imported successfully');
		}
    }

	
};

