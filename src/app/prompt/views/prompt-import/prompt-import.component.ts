import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Post } from '../../models/Post';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-prompt-import',
  templateUrl: './prompt-import.component.html',
  styleUrls: ['./prompt-import.component.scss']
})
export class PromptImportComponent implements OnInit {

  jsonData : string = '';  
  showDelayedView: boolean = false;
  

  constructor(
    private ref: DynamicDialogRef,
    private authService: AuthService,
  ) {
  }


  ngOnInit(): void {
    setTimeout(() => {
      this.showDelayedView = true;
    }, 1000);
  }
  


  onClose() {
    this.ref.close({});
  }


  onImport() {

    let posts: Post[] = [];

    try {
      let parsedJson = this.dataRaw;      
      //let parsedJson = JSON.parse(this.jsonData);

      posts = this.parseChatGPT(parsedJson);
    }
    catch (e) {}

    this.ref.close({data: posts});
  }


  parseChatGPT(parsedJson: any) : Post[] {

    let posts: Post[] = [];    
    let arrayData = [];

    let keys = Object.keys(parsedJson.mapping);
    for (let key of keys) {
      arrayData.push(parsedJson.mapping[key]);
    }
    
    arrayData = arrayData.filter(item => item.message != null && (item.message.author.role == 'user' || item.message.author.role == 'assistant'));
    arrayData.sort((a, b) => {return a.message.create_time - b.message.create_time});

    let finedArray = arrayData.map(item => {return {author: item.message.author.role, content: item.message.content.parts.join('\n')}});
    for (let message of finedArray) {

      let item : Post = null;

      if (message.author == 'user') {
        item = {
          author: this.authService.getUserInfo().displayName,
          content: message.content.replaceAll('\n', '<br/>\n'),
          type: 'user',
        };
    
      }
      else {
        item = {
          author: 'Assistant',
          content: message.content,
          type: 'ia',
        };
    
      }

      posts.push(item);
    }

    return posts;
  }



  dataRaw = {
    "title": "Generación y degradación: JS.",
    "create_time": 1714123811.458392,
    "update_time": 1714124599.637891,
    "mapping": {
        "7777f155-7814-4efe-b710-34c048a41e52": {
            "id": "7777f155-7814-4efe-b710-34c048a41e52",
            "message": {
                "id": "7777f155-7814-4efe-b710-34c048a41e52",
                "author": {
                    "role": "system",
                    "name": null,
                    "metadata": {}
                },
                "create_time": null,
                "update_time": null,
                "content": {
                    "content_type": "text",
                    "parts": [
                        ""
                    ]
                },
                "status": "finished_successfully",
                "end_turn": true,
                "weight": 0.0,
                "metadata": {
                    "is_visually_hidden_from_conversation": true
                },
                "recipient": "all"
            },
            "parent": "aaa198b5-900e-42de-afca-776fb2f05a1b",
            "children": [
                "aaa2f349-c42c-4b6b-9238-abdf3a1281d4"
            ]
        },
        "aaa198b5-900e-42de-afca-776fb2f05a1b": {
            "id": "aaa198b5-900e-42de-afca-776fb2f05a1b",
            "message": null,
            "parent": null,
            "children": [
                "7777f155-7814-4efe-b710-34c048a41e52"
            ]
        },
        "aaa2f349-c42c-4b6b-9238-abdf3a1281d4": {
            "id": "aaa2f349-c42c-4b6b-9238-abdf3a1281d4",
            "message": {
                "id": "aaa2f349-c42c-4b6b-9238-abdf3a1281d4",
                "author": {
                    "role": "user",
                    "name": null,
                    "metadata": {}
                },
                "create_time": 1714123811.459487,
                "update_time": null,
                "content": {
                    "content_type": "text",
                    "parts": [
                        "Hazme un algoritmo en javascript para resolver este problema.\n\nBackground\nEvery time you photocopy something the quality of the copy is never quite as good as the original.\n\nBut then you make a copy of copy, and then a copy of that copy, et cetera... And the results get worse each time.\n\nThis kind of degradation is called Generation Loss.\n\nHere is a fun example of generation loss copying VHS tapes.\n\nKata task\nIn this Kata you will be given 2 sheets of paper.\n\nThe first one is the original, and the second one is the result of copying many times. Let's call these papers orig and copy.\n\nOnly a small % of generation loss happens at each copy, but the effect is cummulative and the copies quickly become more like gibberish.\n\nYour task is to return true/false if orig is a possible ancestor of copy.\n\nNotes\nThe orig document may include any kind of character\nCopied characters will degrade as follows: A-Z ⇒ a-z ⇒ # ⇒ + ⇒ : ⇒ . ⇒  \nAny other character not mentioned above (e.g. digits) do not degrade\nFor the uppercase to lowercase degradation the letters must be the same (i.e. A ⇒ a ... Z ⇒ z)\nExample\n(5% error rate)"
                    ]
                },
                "status": "finished_successfully",
                "end_turn": null,
                "weight": 1.0,
                "metadata": {
                    "request_id": "87a58d7c4bd91c94-AMS",
                    "timestamp_": "absolute",
                    "message_type": null
                },
                "recipient": "all"
            },
            "parent": "7777f155-7814-4efe-b710-34c048a41e52",
            "children": [
                "797f4e9d-d65b-4b0f-95e4-794bf8765833"
            ]
        },
        "797f4e9d-d65b-4b0f-95e4-794bf8765833": {
            "id": "797f4e9d-d65b-4b0f-95e4-794bf8765833",
            "message": {
                "id": "797f4e9d-d65b-4b0f-95e4-794bf8765833",
                "author": {
                    "role": "assistant",
                    "name": null,
                    "metadata": {}
                },
                "create_time": 1714123824.79224,
                "update_time": null,
                "content": {
                    "content_type": "text",
                    "parts": [
                        "Aquí tienes un algoritmo en JavaScript para resolver este problema:\n\n```javascript\nfunction isPossibleAncestor(orig, copy) {\n    // Normalize both strings to lowercase\n    orig = orig.toLowerCase();\n    copy = copy.toLowerCase();\n\n    // Iterate through each character in orig\n    for (let i = 0; i < orig.length; i++) {\n        // Check if the characters at the same position in orig and copy match\n        if (orig[i] !== copy[i]) {\n            // If they don't match, check if they are allowed to degrade according to the rules\n            if (!isAllowedDegrade(orig[i], copy[i])) {\n                // If degradation is not allowed, orig cannot be an ancestor of copy\n                return false;\n            }\n        }\n    }\n\n    // If all characters in orig match those in copy according to degradation rules, orig is a possible ancestor\n    return true;\n}\n\nfunction isAllowedDegrade(origChar, copyChar) {\n    // Define degradation rules\n    const degradationRules = {\n        'A': 'a',\n        'B': 'b',\n        'C': 'c',\n        'D': 'd',\n        'E': 'e',\n        'F': 'f',\n        'G': 'g',\n        'H': 'h',\n        'I': 'i',\n        'J': 'j',\n        'K': 'k',\n        'L': 'l',\n        'M': 'm',\n        'N': 'n',\n        'O': 'o',\n        'P': 'p',\n        'Q': 'q',\n        'R': 'r',\n        'S': 's',\n        'T': 't',\n        'U': 'u',\n        'V': 'v',\n        'W': 'w',\n        'X': 'x',\n        'Y': 'y',\n        'Z': 'z',\n        'a': '#',\n        'b': '+',\n        'c': ':',\n        'd': '.',\n        '#': '+',\n        '+': ':',\n        ':': '.',\n        '.': ' ',\n    };\n\n    // Check if the degradation from origChar to copyChar is allowed according to the rules\n    return degradationRules[origChar] === copyChar;\n}\n```\n\nEste algoritmo comprueba si la cadena `orig` es un posible ancestro de la cadena `copy` siguiendo las reglas de degradación dadas."
                    ]
                },
                "status": "finished_successfully",
                "end_turn": true,
                "weight": 1.0,
                "metadata": {
                    "finish_details": {
                        "type": "stop",
                        "stop_tokens": [
                            100260
                        ]
                    },
                    "citations": [],
                    "gizmo_id": null,
                    "message_type": null,
                    "model_slug": "text-davinci-002-render-sha",
                    "default_model_slug": "text-davinci-002-render-sha",
                    "pad": "AAA",
                    "parent_id": "aaa2f349-c42c-4b6b-9238-abdf3a1281d4",
                    "is_complete": true,
                    "request_id": "87a58d7c4bd91c94-AMS",
                    "timestamp_": "absolute",
                    "model_switcher_deny": []
                },
                "recipient": "all"
            },
            "parent": "aaa2f349-c42c-4b6b-9238-abdf3a1281d4",
            "children": [
                "aaa2169a-208c-4249-9a23-abbf6d3e75b6"
            ]
        },
        "aaa2169a-208c-4249-9a23-abbf6d3e75b6": {
            "id": "aaa2169a-208c-4249-9a23-abbf6d3e75b6",
            "message": {
                "id": "aaa2169a-208c-4249-9a23-abbf6d3e75b6",
                "author": {
                    "role": "user",
                    "name": null,
                    "metadata": {}
                },
                "create_time": 1714123950.034084,
                "update_time": null,
                "content": {
                    "content_type": "text",
                    "parts": [
                        "Traduce esto a castellano.\n\nBackground\nEvery time you photocopy something the quality of the copy is never quite as good as the original.\n\nBut then you make a copy of copy, and then a copy of that copy, et cetera... And the results get worse each time.\n\nThis kind of degradation is called Generation Loss.\n\nHere is a fun example of generation loss copying VHS tapes.\n\nKata task\nIn this Kata you will be given 2 sheets of paper.\n\nThe first one is the original, and the second one is the result of copying many times. Let's call these papers orig and copy.\n\nOnly a small % of generation loss happens at each copy, but the effect is cummulative and the copies quickly become more like gibberish.\n\nYour task is to return true/false if orig is a possible ancestor of copy.\n\nNotes\nThe orig document may include any kind of character\nCopied characters will degrade as follows: A-Z ⇒ a-z ⇒ # ⇒ + ⇒ : ⇒ . ⇒  \nAny other character not mentioned above (e.g. digits) do not degrade\nFor the uppercase to lowercase degradation the letters must be the same (i.e. A ⇒ a ... Z ⇒ z)\nExample\n(5% error rate)"
                    ]
                },
                "status": "finished_successfully",
                "end_turn": null,
                "weight": 1.0,
                "metadata": {
                    "request_id": "87a590debaae1c94-AMS",
                    "timestamp_": "absolute",
                    "message_type": null
                },
                "recipient": "all"
            },
            "parent": "797f4e9d-d65b-4b0f-95e4-794bf8765833",
            "children": [
                "c3d54f65-4fd2-43db-b063-d35807638002"
            ]
        },
        "c3d54f65-4fd2-43db-b063-d35807638002": {
            "id": "c3d54f65-4fd2-43db-b063-d35807638002",
            "message": {
                "id": "c3d54f65-4fd2-43db-b063-d35807638002",
                "author": {
                    "role": "assistant",
                    "name": null,
                    "metadata": {}
                },
                "create_time": 1714123958.796586,
                "update_time": null,
                "content": {
                    "content_type": "text",
                    "parts": [
                        "Antecedentes:\nCada vez que haces una fotocopia, la calidad de la copia nunca es tan buena como la del original.\n\nPero luego haces una copia de esa copia, y luego otra copia de esa copia, etcétera... Y los resultados empeoran cada vez más.\n\nEste tipo de degradación se llama Pérdida de Generación.\n\nAquí tienes un ejemplo divertido de pérdida de generación al copiar cintas VHS.\n\nTarea de Kata:\nEn esta Kata se te darán 2 hojas de papel.\n\nLa primera es la original, y la segunda es el resultado de hacer muchas copias. Llamaremos a estas hojas orig y copia.\n\nSolo un pequeño % de pérdida de generación ocurre en cada copia, pero el efecto es acumulativo y las copias rápidamente se vuelven más parecidas a un galimatías.\n\nTu tarea es devolver verdadero/falso si orig es un posible ancestro de copia.\n\nNotas:\nEl documento orig puede incluir cualquier tipo de carácter.\nLos caracteres copiados se degradarán de la siguiente manera: A-Z ⇒ a-z ⇒ # ⇒ + ⇒ : ⇒ . ⇒  \nCualquier otro carácter no mencionado anteriormente (por ejemplo, dígitos) no se degradarán.\nPara la degradación de mayúsculas a minúsculas, las letras deben ser iguales (es decir, A ⇒ a ... Z ⇒ z)\nEjemplo:\n(Tasa de error del 5%)"
                    ]
                },
                "status": "finished_successfully",
                "end_turn": true,
                "weight": 1.0,
                "metadata": {
                    "finish_details": {
                        "type": "stop",
                        "stop_tokens": [
                            100260
                        ]
                    },
                    "citations": [],
                    "gizmo_id": null,
                    "message_type": null,
                    "model_slug": "text-davinci-002-render-sha",
                    "default_model_slug": "text-davinci-002-render-sha",
                    "parent_id": "aaa2169a-208c-4249-9a23-abbf6d3e75b6",
                    "is_complete": true,
                    "request_id": "87a590debaae1c94-AMS",
                    "timestamp_": "absolute",
                    "model_switcher_deny": []
                },
                "recipient": "all"
            },
            "parent": "aaa2169a-208c-4249-9a23-abbf6d3e75b6",
            "children": [
                "aaa296d2-ef25-4d8f-a595-10fce46c0deb"
            ]
        },
        "aaa296d2-ef25-4d8f-a595-10fce46c0deb": {
            "id": "aaa296d2-ef25-4d8f-a595-10fce46c0deb",
            "message": {
                "id": "aaa296d2-ef25-4d8f-a595-10fce46c0deb",
                "author": {
                    "role": "user",
                    "name": null,
                    "metadata": {}
                },
                "create_time": 1714124584.136073,
                "update_time": null,
                "content": {
                    "content_type": "text",
                    "parts": [
                        "Resuelve este problema con javascript.\n\nBackground\nEvery time you photocopy something the quality of the copy is never quite as good as the original.\n\nBut then you make a copy of copy, and then a copy of that copy, et cetera... And the results get worse each time.\n\nThis kind of degradation is called Generation Loss.\n\nHere is a fun example of generation loss copying VHS tapes.\n\nKata task\nIn this Kata you will be given 2 sheets of paper.\n\nThe first one is the original, and the second one is the result of copying many times. Let's call these papers orig and copy.\n\nOnly a small % of generation loss happens at each copy, but the effect is cummulative and the copies quickly become more like gibberish.\n\nYour task is to return true/false if orig is a possible ancestor of copy.\n\nNotes\nThe orig document may include any kind of character\nCopied characters will degrade as follows: A-Z ⇒ a-z ⇒ # ⇒ + ⇒ : ⇒ . ⇒  \nAny other character not mentioned above (e.g. digits) do not degrade\nFor the uppercase to lowercase degradation the letters must be the same (i.e. A ⇒ a ... Z ⇒ z)"
                    ]
                },
                "status": "finished_successfully",
                "end_turn": null,
                "weight": 1.0,
                "metadata": {
                    "request_id": "87a5a059ac241c94-AMS",
                    "timestamp_": "absolute",
                    "message_type": null
                },
                "recipient": "all"
            },
            "parent": "c3d54f65-4fd2-43db-b063-d35807638002",
            "children": [
                "528aa3fd-b5fa-4f85-8409-a1860caf96f5"
            ]
        },
        "528aa3fd-b5fa-4f85-8409-a1860caf96f5": {
            "id": "528aa3fd-b5fa-4f85-8409-a1860caf96f5",
            "message": {
                "id": "528aa3fd-b5fa-4f85-8409-a1860caf96f5",
                "author": {
                    "role": "assistant",
                    "name": null,
                    "metadata": {}
                },
                "create_time": 1714124599.356153,
                "update_time": null,
                "content": {
                    "content_type": "text",
                    "parts": [
                        "Para resolver este problema en JavaScript, necesitaremos crear una función que compare las dos hojas de papel, `orig` y `copy`, y determine si `orig` es un posible ancestro de `copy`. Aquí tienes una posible solución:\n\n```javascript\nfunction isPossibleAncestor(orig, copy) {\n    // Convertimos ambas hojas a minúsculas para hacer la comparación\n    orig = orig.toLowerCase();\n    copy = copy.toLowerCase();\n\n    // Iteramos sobre cada carácter en la hoja original\n    for (let i = 0; i < orig.length; i++) {\n        // Comprobamos si los caracteres en la misma posición en orig y copy coinciden\n        if (orig[i] !== copy[i]) {\n            // Si los caracteres no coinciden, comprobamos si se permite la degradación\n            if (!isAllowedDegrade(orig[i], copy[i])) {\n                // Si la degradación no está permitida, orig no puede ser un ancestro de copy\n                return false;\n            }\n        }\n    }\n\n    // Si todos los caracteres en orig coinciden con los de copy según las reglas de degradación, orig es un posible ancestro\n    return true;\n}\n\nfunction isAllowedDegrade(origChar, copyChar) {\n    // Definimos las reglas de degradación\n    const degradationRules = {\n        'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'f': 'f', 'g': 'g', 'h': 'h', 'i': 'i', 'j': 'j', 'k': 'k',\n        'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o', 'p': 'p', 'q': 'q', 'r': 'r', 's': 's', 't': 't', 'u': 'u', 'v': 'v',\n        'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z', '#': '#', '+': '+', ':': ':', '.': '.'\n    };\n\n    // Comprobamos si la degradación de origChar a copyChar está permitida según las reglas\n    return degradationRules[origChar] === copyChar;\n}\n```\n\nEsta función `isPossibleAncestor` devuelve `true` si `orig` es un posible ancestro de `copy` y `false` en caso contrario. La función `isAllowedDegrade` comprueba si la degradación de un carácter en `orig` a un carácter en `copy` está permitida según las reglas especificadas."
                    ]
                },
                "status": "finished_successfully",
                "end_turn": true,
                "weight": 1.0,
                "metadata": {
                    "finish_details": {
                        "type": "stop",
                        "stop_tokens": [
                            100260
                        ]
                    },
                    "citations": [],
                    "gizmo_id": null,
                    "message_type": null,
                    "model_slug": "text-davinci-002-render-sha",
                    "default_model_slug": "text-davinci-002-render-sha",
                    "pad": "AAAAAAAAAAAAAAAAAAAAAA",
                    "parent_id": "aaa296d2-ef25-4d8f-a595-10fce46c0deb",
                    "is_complete": true,
                    "request_id": "87a5a059ac241c94-AMS",
                    "timestamp_": "absolute",
                    "model_switcher_deny": []
                },
                "recipient": "all"
            },
            "parent": "aaa296d2-ef25-4d8f-a595-10fce46c0deb",
            "children": []
        }
    },
    "moderation_results": [],
    "current_node": "528aa3fd-b5fa-4f85-8409-a1860caf96f5",
    "plugin_ids": null,
    "conversation_id": "06210ef7-0be2-43ca-882c-7e1f2b407773",
    "conversation_template_id": null,
    "gizmo_id": null,
    "is_archived": false,
    "safe_urls": [],
    "default_model_slug": "text-davinci-002-render-sha"
};

}
