// ==UserScript==
// @name         wiki helper
// @namespace    https://github.com/bangumi/scripts/yonjar
// @version      0.1
// @description  个人自用wiki助手
// @require      https://unpkg.com/wanakana@4.0.2/umd/wanakana.min.js
// @author       Yonjar
// @include      /^https?:\/\/(bgm\.tv|chii\.in|bangumi\.tv)/
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  if (/person\/new/.test(location.href)) {
    kana2romaji();
  }
  if (/add_related/.test(location.href)) {
    bgm_id_format();
  }
  if (/\/\d+\/characters/.test(location.href)) {
    let btn_chara = document.createElement("button");
    let btn_prn = document.createElement("button");

    btn_chara.textContent = "导出角色id";
    btn_prn.textContent = "导出人物id";

    btn_chara.addEventListener(
      "click",
      () => {
        toIDstr(true);
      },
      false
    );
    btn_prn.addEventListener(
      "click",
      () => {
        toIDstr(false);
      },
      false
    );

    document.querySelector("#columnInSubjectB").append(btn_chara, btn_prn);
  }

  // 导出当前页面的角色或人物的id
  // 默认导出角色的id
  function toIDstr(isChara = true) {
    let list = "";

    if (isChara) {
      list = document.querySelectorAll("h2 a.l");
    } else {
      list = document.querySelectorAll("div.actorBadge a.l");
    }

    let id_list = [];
    let tmp = Array.from(list).map((el) => el.href.match(/\d+/)[0]);

    if (tmp.length > 10) {
      while (tmp.length != 0) {
        id_list.push(tmp.splice(0, 10));
      }
    } else {
      id_list = tmp;
    }

    let output = JSON.stringify(id_list);
    copy(output);
    //prompt("bgm_id=", output);
  }

  // 关联条目时链接转bgm_id=\d+
  function bgm_id_format() {
    let textarea = document.querySelector("#subjectName");

    let parameters = [
      {
        regx: /\S+?\/(\d+)/,
        substitute: "bgm_id=$1",
      },
    ];

    //事件处理函数 回复框失去焦点时触发
    textarea.addEventListener("blur", () => {
      try {
        let data = JSON.parse(textarea.value);
        let btn_list = [];
        for (let i = 0; i < data.length; i++) {
          var btn = document.createElement("button");
          // btn_list.push();
          btn.textContent = "id分组" + i;
          btn.addEventListener("click", () => {
            textarea.value = "bgm_id=" + data[i].join(",");
          });
          document.querySelector("#subject_inner_info").append(btn);
        }
      } catch (e) {
        for (let a of parameters) {
          textarea.value = textarea.value.replace(a.regx, a.substitute);
        }
      }
    });
  }

  // 复制
  function copy(text) {
    let copyText = document.createElement("input");
    document.body.append(copyText);
    copyText.value = text;
    copyText.select();
    document.execCommand("Copy");
    copyText.style.display = "none";
  }

  // 新增人物时假名转罗马字
  function kana2romaji() {
    let kana_input = document.querySelector(
      "#infobox_normal > input:nth-child(18)"
    );
    let romaji_input = document.querySelector(
      "#infobox_normal > input:nth-child(22)"
    );

    function firstUpperCase(str) {
      return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    }

    kana_input.addEventListener("blur", () => {
      romaji_input.value = firstUpperCase(wanakana.toRomaji(kana_input.value));
    });

    //   人物简介
    let textarea = document.querySelector("#crt_summary");

    let parameters = [
      {
        regx: /\[\d+\]/g,
        substitute: "",
      },
    ];

    textarea.addEventListener("blur", () => {
      for (let a of parameters) {
        textarea.value = textarea.value.replace(a.regx, a.substitute);
      }
    });
  }
})();