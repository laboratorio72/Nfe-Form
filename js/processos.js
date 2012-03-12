/*
* @author     Renato Siroma<rsiroma@shoes4you.com.br>
* @property   Shoes4you
* @copyright  Copyright (c) 2012 Shoes4you (http://www.shoes4you.com.br)
* Version: 0.1
*/
var id_div_target_inputs = "inputs-hid";
var id_table_list = "table-familia";
var name_input_name ="codigo";
var name_input_num ="descricao";
var editNow = "";

function cl(str){console.log(str);}

$(function(){
	// santa criatividade!
	jQuery.fn.reset = function() {
		this.each(function(){
			if($(this).is('form')) {
				var button = jQuery(jQuery('<input type="reset" />'));
				button.hide();
				$(this).append(button);
				button.click().remove();
				$(this).find("textarea").each(function(){
					$(this).text("");
				});
			} else if($(this).parent('form').size()) {
				var button = jQuery(jQuery('<input type="reset" />'));
				button.hide();
				$(this).parent('form').append(button);
				$(this).parent('form').find("textarea").each(function(){
					$(this).text("");
				});
				button.click().remove();
			} else if($(this).find('form').size()) {
				$(this).find('form').each(function(){
					var button = jQuery(jQuery('<input type="reset" />'));
					button.hide();
					$(this).append(button);
					$(this).find("textarea").each(function(){
						$(this).text("");
					});
					button.click().remove();
				});
			}
		})
		return this;
	};

	/*Pega o menino input e processa conteudo dele e abre o dialog*/
	jQuery.fn.openInput = function(hash){
		if($("#list_table_"+hash).length<=0){
			cl("Erro ao recuperar input hidden");
			return false;
		}
		
		var conteudo = $.evalJSON($("#list_table_"+hash).val());
		var form = $("#frmCriaFilho");

		//Varre form e apliac valores depois abre o dialog
		for (x in conteudo){
			var objNow = form.find("[name='"+x+"']");
			var type = objNow.attr("type");
			var content = eval("conteudo."+x);
			var tagName = objNow.get(0).tagName.toLowerCase();
			
			if(type=='radio' || type=='checkbox'){
				
				objNow.each(function(){
					if($(this).val() == content){
						$(this).attr("checked",true);
					}
				});
				
			}else if(type=='text'){
				
				objNow.val( content );
				
			}else if(tagName == "select"){
				
				objNow.find("option").each(function(){
					if($(this).val() == content){
						$(this).attr("selected",true);
					}
				});
				
			}else if(tagName == "textarea"){
				
				objNow.text( content );
				
			}
		}

		editNow = hash;
		$('#dialog').dialog("open");
	}

	/*Ações das linhas*/
	jQuery.fn.editLine = function(idField){
		if(idField.length > 6){
			idField = idField.replace("edit_line_","");

			if( $("#list_table_"+idField).length > 0 ){
				if( $("#list_table_"+idField).val() != "" && $("#list_table_"+idField).val() != "{}" ){
					jQuery.fn.openInput(idField);
				}else{
					cl("Linha vazia");
					$("#tr_list_table_"+idField).remove();
					$("#list_table_"+idField).remove();
					$("#tr_list_table_"+idField).remove();
				}
			}else{
				cl("Não existe conteudo para este Id");
			}
			
		}else{
			cl("Id para editar inválido");
		}
	}
	
	jQuery.fn.deleteLine = function(idField){
		if(idField.length > 6){
			idField = idField.replace("delete_line_","");

			$("#list_table_"+idField).remove();
			
			$("#tr_list_table_"+idField).fadeOut("slow", function(){
				$("#tr_list_table_"+idField).remove();
			});
			editNow = "";
		}else{
			cl("Erro ao deletar ->"+idField);
		}
	}
	
	jQuery.fn.inputToTr = function(hashInput, jsonContent){
		//  criar TR com hashInput
			//Valida se existe Table
			if($("#"+id_table_list).length <= 0){
				cl("Tabela que recebe lista não existe");
			}else{
				var td1 = eval("$.evalJSON(jsonContent)."+name_input_name );
				var td2 = eval("$.evalJSON(jsonContent)."+name_input_num );
				var linha = "<tr id='tr_list_table_"+hashInput+"'><td>"+td1+"</td><td>"+td2+"</td><td><a id='edit_line_"+hashInput+"' onclick='javascript: jQuery.fn.editLine(this.id);' href='#'>Edit</a> | <a onclick='javascript: jQuery.fn.deleteLine(this.id);' id='delete_line_"+hashInput+"' href='#'>Del</a> </td></tr>";
				$("#"+id_table_list).append(linha);
			}
	}
	
	jQuery.fn.obJectToInput = function(obj){
		var jsonContent = $.toJSON(obj);
		var hash =  md5( jsonContent ); //pega essa chave gera o input hidden

		//Se está editado
		if(editNow!=""){
			hash = editNow;
			editNow = "";
		}
		
		//Valida se existe a div target
		if($("#"+id_div_target_inputs).length <= 0){
			cl("Div target dos inputs não existe");
		}else{
			//Limpa e Cria o input
			if( $("#"+id_div_target_inputs).find("#list_table_"+hash).length > 0){ 
				$("#"+id_div_target_inputs).find("#list_table_"+hash).remove();
				$("#tr_list_table_"+hash).remove();
			}
			
			var inputHid = "<input type='hidden' name='list_table[]' id='list_table_"+hash+"' value='"+jsonContent+"' />";
			
			$("#"+id_div_target_inputs).append(inputHid);

			//sefoi
			if( $("#"+id_div_target_inputs).find("#list_table_"+hash).length > 0){
				jQuery.fn.inputToTr(hash,jsonContent);
			}
		}
	}
	
	jQuery.fn.varreCriaSerializado = function(){
		
		if($(this[0]).length > 0){
			
			var itens = new Object();
			//input,textarea,select
			$(this[0]).find("input,textarea,select").each(function(){
				var conteudo = "";
				var name = $(this).attr("name");if(name=="undefined" || name==undefined)name="none";
				var id = $(this).attr("id");if(id=="undefined" || id==undefined)id="none";
				var type = $(this).get(0).tagName.toLowerCase();
				
				if(type=="select"){
					$(this).find("option").each(function(){
						if( $(this).attr("selected") == 'selected'){
							if( $(this).val().length > 0 )
								conteudo = $(this).val();
						}
					});
				}else if( $(this).attr("type")=='radio' ){ //verifica se o Radio tá selecionado pra não pegar tudo
					if( this.checked == true )
						conteudo = $(this).val();
				}else if( $(this).attr("type")=='checkbox' ){ //Verifica se é checkbox selecionad
					if(this.checked == true)
						conteudo = $(this).val();
				}else if( $(this).val().length > 0 ){ //others
					conteudo = $(this).val();
				}else if( $(this).text().length >0 ){ //TextArea
					conteudo = $(this).text();
				}
				
				//Atribui valor no array quando tem conteudo
				if( conteudo.length > 0 ){
					conteudo = nl2br(conteudo);
					eval("itens."+str_replace("-","_",name)+"='"+conteudo+"'");
				}
				
			});
			jQuery.fn.obJectToInput( itens );
		}

		return false;
		
	};
	
	// Dialog			
	$('#dialog').dialog({
		autoOpen: true, /*Open on ready*/
		width: 900, /*Force Width*/
		/*dialogClass: 'alert', /*Set class*/
		/*closeOnEscape: false,/*Close on press ESC*/
		/*modal: true,/*Overlay*/
		position: 'center',/*Position open*/
		 
		buttons: {
			"Salvar": function() {
				$("#frmCriaFilho").varreCriaSerializado();
				$("#frmCriaFilho").reset();
				$(this).dialog("close");
			},
			"Cancel": function() { 
				$(this).dialog("close");
			}
		}
	});
	
	// Dialog Link
	$('#dialog_link').click(function(){
		$("#frmCriaFilho").reset();
		$('#dialog').dialog('open');
		return false;
	});
	
});
			