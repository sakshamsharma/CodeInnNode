#include <stdio.h>

int main()
{
    int num=0;
    do
    {
		scanf("%d", &num);
        if (num!=42)
        printf("%d\n", num);
	}while(num!=42);
 return 0;
}