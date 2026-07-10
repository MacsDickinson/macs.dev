---
title: When Nancy met Event Store
excerpt: There's a new kid on the database front called Event Store. Wiring it into a simple Nancy web project with the .NET API.
date: 2013-11-16
tag: Nancy
---

There's a new kid on the database front and it's name is [Event Store][0]. Event store is an open source, functional database that supports the concept of event sourcing.

In this post I am going to take a look at hooking Event Store into a simple Nancy web project using the Event Store .Net API.

![Event Store Logo][3]


1.  [What is Event Sourcing?](#event-sourcing)
2.  [Setting up a local Event Store server](#server-setup)
3.  [Hooking it up to NancyFX](#nancy) 
4.  [Managing Streams](#streams)
5.  [The Verdict](#conclusion)

## What is Event Sourcing?

Event sourcing is an approach to data persistance different to that of a relational or document database. Instead of persisting the state of your data you maintain a sequence of events that have taken place and play them back to get the current state. Recorded events are immutable therefore if the state is updated another event is recorded, and if an object is deleted you simply record an event that describes this. There are a number of different approaches that can be taken from this concept, each with their own benefits. For more detailed information on event sourcing see [this post on the event store wiki][4].

## Setting up a local Event Store server

There is no in-memory offering from Event Store so if you want to develop against it you're going to need to set up a local server. Head over to the [Event Store downloads page][0] and grab the latest stable release. Within the package there is the EventStore.SingleNode executable. This is what you want to run. Note that this requires admin privilages in order to setup the HTTP server. Once this is running you can visit the http management studio at [http://127.0.0.1:2113/][2]. There is a lot of goodness in here; you can run through an example implementation, take a look at stored streams, set up projections, query the data, view live stats and so on. However, in order to do anything useful you will need to log in as admin. The default password is changeme. You should change this once logged on.

## Hooking it up to NancyFX

Plugging the .NET client API into a VS project is easy, it's just a case of pulling down the EventSource.Client NuGet package:

	PM> Install-Package EventStore.Client

With this installed you can look at creating a connection provider for EventStore. This will be responsible for creating the connection to the TCP end point.

    public class EventStoreConnectionProvider
    {
        private const int _tcpIpPort = 1113;

        private static IEventStoreConnection _eventStoreConnection;

        public static IEventStoreConnection EventStore
        {
            get { return _eventStoreConnection ?? (_eventStoreConnection = CreateEventStoreConnection()); }
        }

        private static IEventStoreConnection CreateEventStoreConnection()
        {
            var  tcpEndPoint = new IPEndPoint(IPAddress.Parse("127.0.0.1"), _tcpIpPort);
            
            return EventStoreConnection.Create(ConnectionSettings.Default, tcpEndPoint);
        }
    }

Once you've got this you're going to want to open a connection on application start and drop it into your IoC container.

	protected override void ConfigureApplicationContainer(Nancy.TinyIoc.TinyIoCContainer container)
	{
		base.ConfigureApplicationContainer(container);
		
		var connection = EventStoreConnectionProvider.EventStore;
		connection.Connect();
		container.Register(connection);
	}

## Managing Streams

With the connection in your IoC container you can simply inject it into your modules and start interacting with the desired streams.

	public class BlameModule : NancyModule
	{
		private readonly IEventStoreConnection _connection;

		public BaseModule(IEventStoreConnection connection)
		{
			_connection = connection;
		}
	}

In the next example I am requesting all events (-1 to int.MaxValue) from the top of the "Blames" stream. I'm doing this to get the latest events first. I'm then parsing each Json event to my local Blame object.

    Get["/GetBlames"] = __ =>
        {
            var stream = _connection.ReadStreamEventsBackward("Blames", -1, int.MaxValue, true);
            return stream.Events.Select(x => x.Event.Data.ParseJson<Blame>());
        };

Writing to a stream is also straight forward. First save your object as EventData, this holds the id, type, data and meta data for your model. Then simply append the EventData to the corresponding stream.

    Post["/Add"] = __ =>
        {
            var model = this.Bind<Blame>();

            var eventData = new List<EventData>
                {
                    new EventData(Guid.NewGuid(), "Blame", true, model.ToJsonBytes(), new { DateAdded = DateTime.Now }.ToJsonBytes())
                };
            _eventStoreConnection.AppendToStream("Blames", ExpectedVersion.Any, eventData);
            return null;
        };

## The Verdict

Event Store gives a fresh perspective on how to handle your data. It's a bit of a niche angle and it wont be appropriate for every application but it is another way of working that it is well worth being aware of when you're at the drawing board. Event Store has a lot going for it but it is still young. There are a couple of things that - in my humble opinion - could really boost user adoption.

1.  Improved documentation - There is a lot of information on the Github docs but it isn't the easiest read. This could really benefit with some step by step guides with a few examples, much like the [Nancy docs][5]. Documentation is community submitted on Github so adding to this is down to all of us.
2.  Plug and play - Event Store could really benefit from a Raven style in-memory offering that could be pulled in from NuGet. Setting up a local server isn't difficult but being able to pull everything  from NuGet really adds to the simplicity of the product. Not having an in-memory option is also a bit of a blocking point when it comes to unit testing your application.

The code that I have sampled in this post can be [found on GitHub][6] in the prototype - Code Blame. I will be updating this over time to show off some more features of Event Store for future posts. I'm in the process of getting [Event Store set up in Azure][7] so expect a live version of this site up soon.

   [0]: http://geteventstore.com "Get Event Store"
   [1]: http://download.geteventstore.com/ "Event Store downloads"
   [2]: http://127.0.0.1:2113/
   [3]: /img/event-store.png "event store logo"
   [4]: https://github.com/eventstore/eventstore/wiki/Event-Sourcing-Basics "Event Sourcing Basics"
   [5]: https://github.com/NancyFx/Nancy/wiki/Documentation
   [6]: https://github.com/MacsDickinson/Code-Blame
   [7]: https://github.com/EventStore/EventStore/wiki/Setup-EventStore-on-Windows-Azure
