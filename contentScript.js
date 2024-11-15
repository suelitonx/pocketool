// contentScript.js



//Pegar base url da página
var url = window.location.href;
var baseUrl = '';

if(url.includes('/_')) {
    baseUrl = url.split('/_')[0];
    baseUrl = baseUrl.replace(/[^a-zA-Z0-9]/g, '');
    console.log(baseUrl);
}

var todasColecoes = [];
var collectionsInfo = {};
var colecoesConfig = {
    '0': [],
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': []
};


const saveToStorage = async (key, data) => {
    var chave = baseUrl + '_' + key;
    
    try {
        await chrome.storage.local.set({ [chave]: JSON.stringify(data) });
        console.log('Dados salvos com sucesso:', chave);
        return true;
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        return false;
    }
};

const getFromStorage = async (key) => {
    var chave = baseUrl + '_' + key;
    
    try {
        const result = await chrome.storage.local.get([chave]);
        if (result[chave]) {
            return JSON.parse(result[chave]);
        }
        return null;
    } catch (error) {
        console.error('Erro ao recuperar dados:', error);
        return null;
    }
};

const hasKey = async (key) => {
    var chave = baseUrl + '_' + key;

    try {
        const result = await chrome.storage.local.get(chave);
        return Object.keys(result).length > 0;
    } catch (error) {
        console.error('Erro ao verificar chave:', error);
        return false;
    }
};

// Função de debounce para evitar múltiplas execuções
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function pegarNumeroButtonAtivo() {
    
    var buttons = document.querySelectorAll('button[ctab]');

    if(buttons)
    {
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].className.includes('btn-expanded')) {
                return buttons[i].getAttribute('ctab');
            }
        }
    }

    
    
    return '0';

}

function ocultarColecoes(idbotao) {
    
    var botao = document.getElementById('btn_choose');

    if(idbotao == '0') {

        var collections = document.querySelectorAll('.sidebar-list-item');

        

        if(botao != null && botao != undefined) {
            botao.disabled = true;
        }

        if(collections)
        {
            for (var i = 0; i < collections.length; i++) {
                collections[i].classList.remove('hidden');
            }
        }

        return;

    }

    if(todasColecoes.length == 0) {
        todasColecoes = pegarColecoes();
    }

    var collections = document.querySelectorAll('.sidebar-list-item');

    if(collections)
    {
        botao.disabled = false;

        for (var i = 0; i < collections.length; i++) {
            var url = collections[i].href;
            var collectionId = url.split('collections?collectionId=')[1];

            if (colecoesConfig[idbotao].includes(collectionId) == false) {
                collections[i].classList.add('hidden');
            }
            else {
                collections[i].classList.remove('hidden');
            }
        }
    }

}

function pegarColecoes() {

    var collections = document.querySelectorAll('.sidebar-list-item');

    var collectionIds = [];

    if(collections)
    {
        for (var i = 0; i < collections.length; i++) {
            var url = collections[i].href;
            var name = collections[i].innerText;

            //https://s1.sueliton.shop/_/#/collections?collectionId=_pb_users_auth_

            var collectionId = url.split('collections?collectionId=')[1];

            //collectionIds.push(collectionId);

            collectionIds.push({'id': collectionId,'name': name});

            
        }
    }

    colecoesConfig['0'] = collectionIds;

    return collectionIds;
}

function clickButton(botao) {
    var buttons = document.querySelectorAll('button[ctab]');
    buttons.forEach(function(button) {
        button.className = 'btn btn-outline';
    });
    
    botao.className = 'btn btn-expanded';

    ocultarColecoes(botao.getAttribute('ctab'));

}

/*
function addCSS() {

    
    //Verifica se o CSS já foi adicionado
    var css = document.getElementById('corpo_modal');
    if (css) {
        return;
    }

    //.modal { display: none; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); animation-name: fadeIn; animation-duration: 0.4s } .modal-content { position: fixed; bottom: 0; background-color: #fefefe; width: 100%; animation-name: slideIn; animation-duration: 0.4s } .close { color: white; float: right; font-size: 28px; font-weight: bold; } .close:hover, .close:focus { color: #000; text-decoration: none; cursor: pointer; } .modal-header { padding: 2px 16px; background-color: #5cb85c; color: white; } .modal-body {padding: 2px 16px;} .modal-footer { padding: 2px 16px; background-color: #5cb85c; color: white; }

    //Adiciona o CSS
    var style = document.createElement('style');
    style.innerHTML = `.modal { display: none; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); animation-name: fadeIn; animation-duration: 0.4s } .modal-content { position: fixed; bottom: 0; background-color: #fefefe; width: 100%; animation-name: slideIn; animation-duration: 0.4s } .close { color: white; float: right; font-size: 28px; font-weight: bold; } .close:hover, .close:focus { color: #000; text-decoration: none; cursor: pointer; } .modal-header { padding: 2px 16px; background-color: #5cb85c; color: white; } .modal-body {padding: 2px 16px;} .modal-footer { padding: 2px 16px; background-color: #5cb85c; color: white; }`;
    document.head.appendChild(style);

    //Adiciona o HTML
    var modal = document.createElement('div');

    modal.id = 'myModal';
    modal.className = 'modal';

    var modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    var modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    var span = document.createElement('span');
    span.className = 'close';
    span.innerHTML = '&times;';

    var h2 = document.createElement('h2');
    h2.innerText = 'Modal Header';

    modalHeader.appendChild(span);
    modalHeader.appendChild(h2);

    var modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.id = 'corpo_modal';

    var p1 = document.createElement('p');
    p1.innerText = 'Some text in the Modal Body';

    var p2 = document.createElement('p');
    p2.innerText = 'Some other text...';

    modalBody.appendChild(p1);
    modalBody.appendChild(p2);

    var modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';

    var h3 = document.createElement('h3');
    h3.innerText = 'Modal Footer';

    modalFooter.appendChild(h3);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    //modalContent.appendChild(modalFooter);

    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    var modal = document.getElementById("myModal");
    //modal.style.display = "block";
    var span = modal.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }
    
}
*/

async function carregarStorage() {
    
    for (var i = 1; i <= 5; i++) {
        var key = 'tab_' + i;
        
        var has = await hasKey(key);

        if (has) {
            var colecoes = await getFromStorage(key);
            colecoesConfig[i.toString()] = colecoes;
        }
    }
}

// Função que contém sua lógica principal
function initializeExtension() {
    console.log('Extension initialized/reinitialized');

    if (window.location.href.includes('collections') == false) {
        return;
    }

    const content = document.querySelector('.page-content');
    
    if (content) {
        // Verifica se o botão já existe
        const existingHeader = document.getElementById('custom-header');
        if (!existingHeader) {

            if(todasColecoes.length == 0)
            {
                todasColecoes = pegarColecoes();
            }

            carregarStorage();

            var header = document.createElement('header');
            header.className = 'page-header';
            header.id = 'custom-header';

            //Div 1 -------------------------------------------------

            var div1 = document.createElement('div');
            div1.className = 'inline-flex gap-5';

            var button1 = document.createElement('button');
            button1.type = 'button';
            button1.className = 'btn btn-transparent btn-circle';
            button1.id = 'btn_choose';
            button1.disabled = true;
            button1.onclick = async function()  {
                //alert("Botão 1");
                //alert(pegarNumeroButtonAtivo());
            
                /*  
                <button type="button" class="btn btn-expanded"><i class="ri-add-line"></i> <span class="txt">New record</span></button>
                */

                //Procurar botão 'New record'
                document.querySelectorAll('button').forEach(async function(button) {
                    var clicou = false;
                    
                    if (button.innerText == 'New record') {
                        button.click();
                        clicou = true;
                    }

                    //Esperar 1 segundo
                    await new Promise(r => setTimeout(r, 200));

                    if (clicou) {
                        //overlay-panel-section panel-header
                        var header = document.querySelector('.overlay-panel-section.panel-header');

                        if(header != undefined) {
                            
                            //Pegar h4
                            var h4 = header.querySelector('h4');
                            h4.innerText = 'Choose collections';

                            //overlay-panel-section panel-content
                            var content = document.querySelector('.overlay-panel-section.panel-content');

                            //<form id="record_uFvWb" class="tab-item active"> <div class="form-field "><label for="field_gPjHIjL"><i class="ri-key-line svelte-qc5ngu"></i> <span class="txt">id</span> <span class="flex-fill"></span></label>  <input type="text" id="field_gPjHIjL" placeholder="Leave empty to auto generate..." minlength="15"> </div> <div class="grid m-b-base"><div class="col-lg-6"><div class="form-field "><label for="field_7F7PgVH"><i class="ri-user-line"></i> <span class="txt">Username</span></label> <input type="text" requried="false" placeholder="Leave empty to auto generate..." id="field_7F7PgVH"> </div></div> <div class="col-lg-6"><div class="form-field "><label for="field_PRQBR4B"><i class="ri-mail-line"></i> <span class="txt">Email</span></label> <div class="form-field-addon email-visibility-addon svelte-1751a4d"><button type="button" class="btn btn-sm btn-transparent btn-hint"><span class="txt">Public: Off</span></button></div> <input type="email" autofocus="" autocomplete="off" id="field_PRQBR4B" class="svelte-1751a4d"> </div></div> <div class="col-lg-12"> <div class="block"><div class="grid"><div class="col-sm-6"><div class="form-field required"><label for="field_ibe4Jqi"><i class="ri-lock-line"></i> <span class="txt">Password</span></label> <input type="password" autocomplete="new-password" id="field_ibe4Jqi" required=""> <div class="form-field-addon"><button tabindex="-1" type="button" aria-label="Generate" class="btn btn-circle btn-sm btn-hint btn-transparent svelte-1md8247" aria-expanded="false"><i class="ri-sparkling-line" aria-hidden="true"></i> <div class="toggler-container" tabindex="-1" role="menu"></div></button></div> </div></div> <div class="col-sm-6"><div class="form-field required"><label for="field_wHvv6lU"><i class="ri-lock-line"></i> <span class="txt">Password confirm</span></label> <input type="password" autocomplete="new-password" id="field_wHvv6lU" required=""> </div></div></div></div></div> <div class="col-lg-12"><div class="form-field form-field-toggle"><input type="checkbox" id="field_eNv1lQ4"> <label for="field_eNv1lQ4">Verified</label> </div></div></div>  </form>

                            var form = content.querySelector('form');

                            form.innerHTML = '';

                            //<div class="grid m-b-base">   <div class="col-lg-6"><div class="form-field form-field-toggle"><input type="checkbox" id="field_nbRiNTm"> <label for="field_nbRiNTm">Verified</label> </div></div></div>

                            var div = document.createElement('div');
                            div.className = 'grid m-b-base';

                            var idsChecked = colecoesConfig[pegarNumeroButtonAtivo()];

                            for (var i = 0; i < todasColecoes.length; i++) {

                                var div2 = document.createElement('div');
                                div2.className = 'col-lg-6';

                                var div3 = document.createElement('div');
                                div3.className = 'form-field form-field-toggle';

                                var checkbox = document.createElement('input');
                                checkbox.type = 'checkbox';
                                checkbox.id = 'field_' + todasColecoes[i]['id'];
                                checkbox.value = todasColecoes[i]['id'];

                                if (idsChecked.includes(todasColecoes[i]['id'])) {
                                    checkbox.checked = true;
                                }

                                checkbox.addEventListener('change', function() {
                                    var id = this.value;
                                    var checked = this.checked;

                                    if (checked) {
                                        colecoesConfig[pegarNumeroButtonAtivo()].push(id);
                                    }
                                    else {
                                        colecoesConfig[pegarNumeroButtonAtivo()] = colecoesConfig[pegarNumeroButtonAtivo()].filter(function(value, index, arr){
                                            return value != id;
                                        });
                                    }

                                    ocultarColecoes(pegarNumeroButtonAtivo());
                                });

                                var label = document.createElement('label');
                                label.htmlFor = 'field_' + todasColecoes[i]['id'];
                                label.innerText = todasColecoes[i]['name'];

                                div3.appendChild(checkbox);
                                div3.appendChild(label);
                                div2.appendChild(div3);
                                div.appendChild(div2);
                            }

                            form.appendChild(div);

                            //Recriar o botão "Create" em: <div class="overlay-panel-section panel-footer"><button type="button" class="btn btn-transparent"><span class="txt">Cancel</span></button> <button type="submit" form="record_zhHMX" class="btn btn-expanded"><span class="txt">Create</span></button></div>
                            
                            var footer = document.querySelector('.overlay-panel-section.panel-footer');
                            
                            footer.innerHTML = '';

                            //Recriar botão
                            var button = document.createElement('button');
                            button.type = 'button';
                            button.className = 'btn btn-expanded';

                            var span = document.createElement('span');
                            span.className = 'txt';
                            span.innerText = 'Save';
                            button.appendChild(span);

                            footer.appendChild(button);
                            

                            //Adicionar evento de click
                            button.onclick = async function() {
                    

                                //Salvar no storage
                                var colecoes = colecoesConfig[pegarNumeroButtonAtivo()];

                                console.log(colecoes);

                                var key = 'tab_' + pegarNumeroButtonAtivo();
                                var salvo = await saveToStorage(key, colecoes);

                                if (salvo) {
                                    alert('Saved successfully');

                                    //Pegar botão com a classe 'overlay-close' e clicar nele
                                    document.querySelectorAll('button').forEach(function(button) {
                                        if (button.className.includes('overlay-close')) {
                                            button.click();
                                        }
                                    });
                                }


                                /*

                                //alert(colecoes);

                                //Criar registro
                                var record = {};

                                record['colecoes'] = colecoes;

                                //Salvar registro
                                var key = 'record_' + pegarNumeroButtonAtivo();
                                await saveToStorage(key, record);
                                */
                            }

    
                        }
                    }
                });
            };

            var i1 = document.createElement('i');
            i1.className = 'ri-list-check-3';
            button1.appendChild(i1);

            /*

            var button2 = document.createElement('button');
            button2.type = 'button';
            button2.className = 'btn btn-transparent btn-circle';
            button2.onclick = async function()  {
                //alert("Botão 2");


                
            };

            var i2 = document.createElement('i');
            //i2.className = 'ri-delete-bin-7-line';
            i2.className = 'ri-settings-4-line';
            button2.appendChild(i2);

            */

            div1.appendChild(button1);
            //div1.appendChild(button2);

            header.appendChild(div1);

            //Div 2 -------------------------------------------------

            var div2 = document.createElement('div');
            div2.className = 'btns-group';

            var button3 = document.createElement('button');
            button3.type = 'button';
            button3.className = 'btn btn-expanded';
            button3.setAttribute('ctab', '0');
            button3.id = 'tab_0';
            button3.onclick = async function()  {
                clickButton(this);
            };

            var span3 = document.createElement('span');
            span3.className = 'txt';
            span3.innerText = 'Default';
            button3.appendChild(span3);
            
            div2.appendChild(button3);

            for (var i = 1; i <= 5; i++) {
                var button = document.createElement('button');
                button.type = 'button';
                button.setAttribute('ctab', i.toString());
                button.className = 'btn btn-outline';
                button.id = 'tab_' + i;
                button.onclick = async function()  {
                    clickButton(this);
                };

                var span = document.createElement('span');
                span.className = 'txt';
                span.innerText = i;
                button.appendChild(span);

                div2.appendChild(button);
            }
            

            header.appendChild(div2);

            // ------------------------------------------------------

            content.insertAdjacentElement('afterbegin', header);
        }

        
    }
}

// Executa a primeira vez quando a página carrega
initializeExtension();

// Cria uma versão com debounce da função
const debouncedInit = debounce(initializeExtension, 250);

// Observa mudanças no DOM
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
            debouncedInit();
        }
    }
});

// Configura o observer
observer.observe(document.body, {
    childList: true,
    subtree: true
});

/*
// Limpa o observer quando a página é fechada
window.addEventListener('unload', () => {
    observer.disconnect();
});
*/