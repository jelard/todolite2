using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace TodoLite2.Query
{
    public class GetTodoById
    {
        public class GetTodoByIdResult
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }
        public class Query:IRequest<GetTodoByIdResult>
        {
            public int Id { get; set; }
        }

        public class Handler:IRequestHandler<Query, GetTodoByIdResult>
        {
            public GetTodoByIdResult Handle(Query message)
            {
                return new GetTodoByIdResult()
                {
                    Id = 1,
                    Name = "Todo 1"
                };
            }
        }

    }
}
