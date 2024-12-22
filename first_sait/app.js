function $(ident)
{
    return document.getElementById(ident);
}
function setSiteWidth()
{
    clientwidth=document.body.clientWidth;
    $('mainest').style.width = clientwidth.toString()+"px";
 }