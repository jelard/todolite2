using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MediatR;
using TodoLite2.Query;

namespace TodoLite2.Web.Controllers
{
    public class TodoDetailsController : ApiController
    {
        private readonly IMediator _mediator;

        public TodoDetailsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        public IHttpActionResult Get([FromUri] GetTodoById.Query query)
        {
            var result = _mediator.Send(query);
            return Ok<GetTodoById.GetTodoByIdResult>(result);
        }
    }
}
