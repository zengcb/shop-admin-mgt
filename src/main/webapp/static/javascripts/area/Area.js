
function initComplexArea(a, k, h, p, q, d, b, l) {
    var f = initComplexArea.arguments;
    var m = document.getElementById(a);
    var o = document.getElementById(k);
    var n = document.getElementById(h);
    var e = 0;
    var c = 0;
    if (p != undefined) {
        if (d != undefined) {
            d = parseInt(d);
        }
        else {
            d = 0;
        }
        if (b != undefined) {
            b = parseInt(b);
        }
        else {
            b = 0;
        }
        if (l != undefined) {
            l = parseInt(l);
        }
        else {
            l = 0
        }
        n[0] = new Option("请选择 ", 0);
        for (e = 0; e < p.length; e++) {
            if (p[e] == undefined) {
                continue;
            }
            if (f[6]) {
                if (f[6] == true) {
                    if (e == 0) {
                        continue
                    }
                }
            }
            m[c] = new Option(p[e], e);
            if (d == e) {
                m[c].selected = true;
            }
            c++
        }
        if (q[d] != undefined) {
            c = 0; 
            for (e = 0; e < q[d].length; e++) {
                if (q[d][e] == undefined) 
                { 
                	continue 
                }
                o[c] = new Option(q[d][e], e);
                if (b == e) { o[c].selected = true } c++
            }
        }

        if ($("#" + h + "_div")) 
        { 
        	$("#" + h + "_div").show(); 
        }
        
        if (q[b] != undefined) {
        	c = 0; 
        	for (e = 0; e < q[b].length; e++)
        	{
        		if (q[b][e] == undefined) 
        		{ 
        			continue 
        		}

        		n[c] = new Option(q[b][e], e);
        		if (l == e) 
        		{ 
        			n[c].selected = true 
        		} 
        		c++
        	}
        }
    }
}
function changeComplexProvince(f, k, e, d) {
    var c = changeComplexProvince.arguments; var h = document.getElementById(e);
    var g = document.getElementById(d); var b = 0; var a = 0; removeOptions(h); f = parseInt(f);
    if (k[f] != undefined) {
        for (b = 0; b < k[f].length; b++) {
            if (k[f][b] == undefined) { continue }
            h[a] = new Option(k[f][b], b); a++
        }
    }
    removeOptions(g); g[0] = new Option("请选择 ", 0);
    if ($("#" + d + "_div")) { $("#" + d + "_div").show(); }
}

 
function changeCity(c, a, t) {
    $("#" + a).html('<option value="0" >请选择</option>');
    $("#" + a).unbind("change");
    c = parseInt(c); 
    var _d = sub_array[c];
    if(_d){
        var str = "";     
        str += "<option value='0' >请选择</option>";
        for (var i = c * 100; i < _d.length; i++) {
            if (_d[i] == undefined) continue; 
            str += "<option value='" + i + "' >" + _d[i] + "</option>";
        }
        $("#" + a).html(str);
    }
}

function removeOptions(c) {
    if ((c != undefined) && (c.options != undefined)) {
        var a = c.options.length;
        for (var b = 0; b < a; b++) {
            c.options[0] = null;
        }
    }
}
