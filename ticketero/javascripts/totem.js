$(function() {  
    /*$('#rut-container').Rut({
      on_error: function(){ alert('Rut incorrecto'); },
      format_on: 'change'
 	});*/

 	$('#totem-rut-erase').click(function(){
 		$('#rut-container').val('');
 		$('#rut-container2').val('');
 	}); 
	
	$('#totem-rut-eraser-2').click(function(){
 		$('#rut-container').val('');
 		$('#rut-container2').val('');
 	}); 

});

function addRut(val)
{
	var current = $("#rut-container").val();
	current = current + val;
	$("#rut-container").val(current);

	var current = $("#rut-container2").val();
	current = current + val;
	$("#rut-container2").val(current);

	formatRut();

}

function checkDV( dvr )
{	
	dv = dvr + ""	
	if ( dv != '0' && dv != '1' && dv != '2' && dv != '3' && dv != '4' && dv != '5' && dv != '6' && dv != '7' && dv != '8' && dv != '9' && dv != 'k'  && dv != 'K')	
	{		
		//alert("Debe ingresar un digito verificador valido");		
		return false;	
	}	
	return true;
}

function checkRut( crut )
{	
	length = crut.length;	
	if ( length < 2 )	
	{		
		//alert("Debe ingresar el rut completo")		
		return false;	
	}	
	if ( length > 2 )		
		rut = crut.substring(0, length - 1);	
	else		
		rut = crut.charAt(0);	
	dv = crut.charAt(length-1);	
	checkDV( dv );	

	if ( rut == null || dv == null )
		return 0	

	var dvr = '0'	
	addition = 0	
	mul  = 2	

	for (i= rut.length -1 ; i >= 0; i--)	
	{	
		addition = addition + rut.charAt(i) * mul		
		if (mul == 7)			
			mul = 2		
		else    			
			mul++	
	}	
	res = addition % 11	
	if (res==1)		
		dvr = 'k'	
	else if (res==0)		
		dvr = '0'	
	else	
	{		
		dvi = 11-res		
		dvr = dvi + ""	
	}
	if ( dvr != dv.toLowerCase() )	
	{		
		//alert("EL rut es incorrecto")		
		return false	
	}

	return true
}

function formatRut() {
	var rutTmp = $('#rut-container2').val();
	var tmpstr = "";
	var length = rutTmp.length;	

	for ( i=0; i < rutTmp.length ; i++ )		
		if ( rutTmp.charAt(i) != ' ' && rutTmp.charAt(i) != '.' && rutTmp.charAt(i) != '-' )
			tmpstr = tmpstr + rutTmp.charAt(i);	
	rutTmp = tmpstr;	
	length = rutTmp.length;	

	for (i=0; i < length ; i++ )	
	{			
		if ( rutTmp.charAt(i) !="0" && rutTmp.charAt(i) != "1" && rutTmp.charAt(i) !="2" && rutTmp.charAt(i) != "3" && rutTmp.charAt(i) != "4" && rutTmp.charAt(i) !="5" && rutTmp.charAt(i) != "6" && rutTmp.charAt(i) != "7" && rutTmp.charAt(i) !="8" && rutTmp.charAt(i) != "9" && rutTmp.charAt(i) !="k" && rutTmp.charAt(i) != "K" )
 		{			
			//alert("El valor ingresado no corresponde a un R.U.T valido");			
			return false;		
		}	
	}	

	var inverse = "";	
	for ( i=(length-1),j=0; i>=0; i--,j++ )		
		inverse = inverse + rutTmp.charAt(i);	
	var formatted = "";	
	formatted = formatted + inverse.charAt(0);	
	formatted = formatted + '-';	
	cnt = 0;	

	for ( i=1,j=2; i<length; i++,j++ )	
	{		
		if ( cnt == 3 )		
		{			
			formatted = formatted + '.';			
			j++;			
			formatted = formatted + inverse.charAt(i);			
			cnt = 1;		
		}		
		else		
		{				
			formatted = formatted + inverse.charAt(i);			
			cnt++;		
		}	
	}	

	inverse = "";	
	for ( i=(formatted.length-1),j=0; i>=0; i--,j++ )		
		inverse = inverse + formatted.charAt(i);	

	$('#rut-container2').val(inverse.toUpperCase());
}
