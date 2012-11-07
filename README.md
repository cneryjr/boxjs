## Documentation

<div class="summary docProperty">
<h3 class="">Public Variables</h3>

<table class="">
<colgroup>
	<col class="col-property">
	<col class="col-type">
	<col class="col-description">
</colgroup>
<tbody><tr>
  <th>Property</th><th>Type</th><th>Description</th>
</tr>
<tr style="background-color: #F8F8F8; border-top: 1px solid #DDDDDD;" id="actionPrefix">
  <td style="color: #4183C4;">global</td>
  <td>Object</td>
  <td>Cont&eacute;m vari&aacute;veis ambientais como scope, request etc.</td>
</tr>
</tbody></table>
</div>

<h3 style="color: #4183C4; border-bottom: 2px dotted #4183C4; margin-right: 200px">namespace http</h3>

<div class="summary docNamespaces">
<h4>Public Functions</h4>

<table class="summaryTable">
<colgroup>
	<col class="col-property">
	<col class="col-type">
	<col class="col-description">
</colgroup>
<tbody><tr>
  <th>Function</th><th>Return</th><th>Description</th>
</tr>
<tr style="background-color: #f8f8f8; border-top: 1px solid #DDDDDD;" id="actionPrefix">
  <td style="color: #4183C4;">parseParams</td>
  <td>Object</td>
  <td>Executa o parse dos par&acirc;metros enviados em uma requisi&ccedil;&atilde;o de GET ou POST, retornando-os em um objeto JSON com chave e valor.<br>
      <span style="color:#4183C4 ">Parameters: <br></span>
      <span style="margin-left: 30px">queryString {String} - cont&eacute;m os par&acirc;metros da chamada URL.</span><br>
      <span style="color:#4183C4 ">Example: <br></span>
      <span style="margin-left: 30px">var qrys = http.parseParams(global.queryString || "");</span>
   </td>
</tr>
<trstyle="background-color: #FFFFFF; border-top: 1px solid #CCCCCC;" id="actionPrefix">
  <td style="color: #4183C4;">uploadFile</td>
  <td>none</td>
  <td>Executa o upload de um arquivo a partir do client web e salva no servidor.<br>
      <span style="color:#4183C4 ">Parameters: <br></span>
      <span style="margin-left: 30px">path {String} - caminho onde o arquivo deve ser salvo.</span><br>
     <span style="color:#4183C4 ">Example: <br></span>
     <span style="margin-left: 30px">http.uploadFile("/temp/");</span>
  </td>
</tr>
</tbody></table>
</div>