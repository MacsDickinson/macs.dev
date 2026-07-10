---
title: Feature Flags and Nancy
excerpt: Shipping unfinished features safely by hiding them behind config-driven feature flags in a Nancy API.
date: 2014-03-31
tag: Architecture
---

Last week I posted about [using feature folders][0] to organise your projects into a more manageable and logical way. This is great for keeping on top of your codebase but with the fourth dimension comes more complication. [Simon Davey][1] gave a great talk at [Agile Yorkshire][2] earlier in the year about his use of feature flags at [Canonical][3]. He suggested using them as a mechanism to separate features in development from features in the wild, reducing the need for feature branches.

I'm not going to go into detail about feature flags here - for that you can read [Martin Fowlers post][4]. In this post I am going to explain how to implement this idea within a Nancy API.


I am currently in the process of writing a community site that we are looking to go live with later this week. The problem is that some of the features aren't in a state to deploy so I need to disable them. In order to achieve this I'm adding feature flags. The first step here is to add a couple of appSettings.

	<add key="Feature_CompleteFeature" value="true"/>
	<add key="Feature_IncompleteFeature" value="false"/>


Depending on the usage of your site this might be something that is worth abstracting out into a database of some sort - say you support multi-tenancy and want to be able to toggle features per customer - but for this scenario they are fine in a config file.

I want to be able to configure my modules to only execute when the required feature is enabled. To accomplish this I add this helper class.

	public class SecurityHooks
	{
	    public static Func<NancyContext, Response> RequiresFeature(string feature)
	    {
	        bool enabled = false;
	        string settingKey = string.Format("Feature_{0}", feature);
	        string settingValue = ConfigurationManager.AppSettings[settingKey];
	        bool.TryParse(settingValue, out enabled);

	        return (ctx) =>
	        {
	            Response response = null;
	            if (!enabled)
	            {
	                response = new Response 
	                { 
                		StatusCode = HttpStatusCode.NotFound 
                	};
	            }
	            return response;
	        };
	    }
	}

What's happening here is pretty straight forward. First we get the config value. If true we simply return null but if false we return a 404 response. I intend this to be used in the same way as the the Nancy function `this.RequiresAuthentication()` so the reason for handling it like this should become clear. To get this into the correct part of the pipeline I add the following extension method.

	public static void RequiresFeature(this INancyModule module, string feature)
	{
	    module.AddBeforeHookOrExecute(SecurityHooks.RequiresFeature(feature), "Requires Feature");
	}

This will add a pre-execution check that will either do nothing or return a 404. To use this I add the following to my module.

    public IncompleteModule()
        : base("incomplete/feature")
    {
        this.RequiresFeature("IncompleteFeature");

        Get["/"] = _ =>
        {
            // Do Stuff
        };
    }

Trying to access the url now returns everyones favorite 404 page.

![Nancy 404 Not Found][5]

Now I can simply set the appSetting to true locally and false in production and there's no risk of anyone stumbling upon something that isn't ready for them. 

   [0]: /../Nancy/Feature-Folders-Nancy
   [1]: https://twitter.com/bloodearnest
   [2]: http://www.agileyorkshire.org/meetings/simon-davy-on-feature-flags-in-production-and-phil-rice-on-constraint-driven-development
   [3]: http://www.canonical.com/
   [4]: http://martinfowler.com/bliki/FeatureToggle.html
   [5]: /img/nancy-not-found.png
