---
title: Localising JavaScript strings in ASP.NET
excerpt: Rich JavaScript plugins are great until you need them in another language. Localising a datepicker through the ASP.NET ScriptManager.
date: 2013-06-20
tag: JavaScript
---

In recent years there has been a huge explosion of rich javascript and jquery plugins giving you everything from [drag and drop][1] to [wysiwyg editors][2] and [autocomplete][3] to [fartscroll.js][4]. Using some of these plugins can be a great way to speed up development and cash in on someone else's hard work. However doing this always comes with an element of risk and it may lack the specific details that you require.


## Zebra_Datepicker

Zebra datepicker is a brilliant, lightweight datepicker and the guy who wrote it, [Stefan Gabos](http://stefangabos.ro/ "stefan gabos"), has done a great job of making it extendible. It is because of this, and that it weighs in at 21KB, that I decided to give it a go on a project I am currently working on. I had previously used the ASP.NET AJAX calendar extender as there are pre-compiled localised versions of the control available, however I now have a constraint that requires me to load the calendar purely through Javascript.

Attaching the date picker was a doddle, the fun part was localising the content. First things first you need to enable script localisation. To do this add the following ScriptManager control to your markup

	<asp:ScriptManager ID="ScriptManager1" runat="server" EnablePartialRendering="true"
	EnableScriptGlobalization="true" EnableScriptLocalization="true" LoadScriptsBeforeUI="true"
	ScriptMode="Release" >
		<Scripts>
			<asp:ScriptReference Path="~/Scripts/Resources.js" ResourceUICultures="es-ES" />
		</Scripts>
	</asp:ScriptManager>

Next you need to create some script files that will act as resources. Add the locale of the resources to the filename of all but your default resources.

	Scripts/Resources.js
	Scripts/Resources.es-ES.js

Next you simply add the localised content as variables in the file. I have encapsulated them in a class to minimise the potential of duplicating variable names:

	var resources = {
		monday: "Monday",
		tuesday: "Tuesday",
		wednesday: "Wednesday",
		// etc
		saturday: "Saturday",
		sunday: "Sunday",
		january: 'January',
		february: 'February',
		// etc
		december: 'December'
	}

And do the same for your other files

	var resources = {
		monday: "Lunes",
		tuesday: "Martes",
		wednesday: "Miércoles",
		// etc
		saturday: "Sábado",
		sunday: "Domingo",
		january: 'Enero',
		february: 'Febrero',
		// etc
		december: 'Diciembre'
	}

Finally specify the resources when you bind your calendar control:

	$('.datepicker-param').Zebra_DatePicker({
		format: 'd/m/Y',
		days: [
			resources.sunday,
			resources.monday,
			resources.tuesday,
			resouces.wednesday,
			resources.thursday,
			resources.friday,
			resources.saturday
		],
		months: [
			resources.january,
			resources.february,
			resources.march,
			resources.april,
			resources.may,
			resources.june,
			resources.july,
			resources.august,
			resources.september,
			resources.october,
			resources.november,
			resources.december
		]
	});

Hey presto, there you have it; a purely JavaScript localised calendar control. This would be a great feature to have included by default but for that to work it wouldn't be able to rely on the ASP.NET ScriptManager. That's something for another day.

![localised datepicker][5]

   [1]: http://pep.briangonzalez.org/ "jquery.pep.js"
   [2]: http://imperavi.com/redactor/ "redactor" 
   [3]: https://github.com/MacsDickinson/jquery.autocomplete "jquery.autocomplete"
   [4]: http://theonion.github.io/fartscroll.js/ "fartscroll"
   [5]: /img/localised_datepicker.png "Localised Zebra Date Picker"
