import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  name: string;
  phone: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'friend';
  time: string;
}

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<User[]>([
    { id: 1, name: 'Denis', phone: '+79097562102', avatar: '', status: 'online' }
  ]);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Привет! Как дела?', sender: 'friend', time: '14:20' },
    { id: 2, text: 'Здравствуй! Всё отлично, спасибо!', sender: 'me', time: '14:22' }
  ]);

  const registeredUsers: User[] = [
    { id: 1, name: 'Denis', phone: '+79097562102', avatar: '', status: 'online' },
    { id: 2, name: 'Алексей', phone: '+79001234567', avatar: '', status: 'offline' },
    { id: 3, name: 'Мария', phone: '+79109876543', avatar: '', status: 'online' },
    { id: 4, name: 'Иван', phone: '+79205556677', avatar: '', status: 'offline' }
  ];

  const filteredUsers = registeredUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
  );

  const handleAddFriend = (user: User) => {
    if (!friends.find((f) => f.id === user.id)) {
      setFriends([...friends, user]);
      toast({
        title: 'Друг добавлен!',
        description: `${user.name} теперь в списке друзей`
      });
    }
  };

  const handleRemoveFriend = (userId: number) => {
    setFriends(friends.filter((f) => f.id !== userId));
    if (selectedFriend?.id === userId) {
      setSelectedFriend(null);
    }
    toast({
      title: 'Друг удалён',
      description: 'Пользователь удалён из списка друзей'
    });
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedFriend) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageText,
        sender: 'me',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  const handleCall = () => {
    if (selectedFriend) {
      toast({
        title: 'Звонок...',
        description: `Звоним ${selectedFriend.name} на ${selectedFriend.phone}`
      });
    }
  };

  const isFriend = (userId: number) => friends.some((f) => f.id === userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Мои Друзья
          </h1>
          <p className="text-muted-foreground">Общайтесь и звоните своим друзьям</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-14 p-1 bg-white/70 backdrop-blur-sm border-2 border-primary/10">
            <TabsTrigger value="search" className="text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
              <Icon name="Search" className="mr-2" size={18} />
              Поиск
            </TabsTrigger>
            <TabsTrigger value="friends" className="text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
              <Icon name="Users" className="mr-2" size={18} />
              Друзья
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
              <Icon name="User" className="mr-2" size={18} />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
              <Icon name="Settings" className="mr-2" size={18} />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6 animate-slide-up">
            <Card className="border-2 border-primary/10 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="relative">
                  <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    placeholder="Поиск по имени или телефону..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base border-2 focus:border-primary"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <Card
                  key={user.id}
                  className="border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16 border-4 border-primary/20">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl font-bold">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {user.status === 'online' && (
                            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-heading font-bold text-foreground">{user.name}</h3>
                          <p className="text-muted-foreground">{user.phone}</p>
                          <Badge variant={user.status === 'online' ? 'default' : 'secondary'} className="mt-1">
                            {user.status === 'online' ? 'В сети' : 'Не в сети'}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleAddFriend(user)}
                        disabled={isFriend(user.id)}
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium px-6 h-11"
                      >
                        {isFriend(user.id) ? (
                          <>
                            <Icon name="Check" className="mr-2" size={18} />
                            В друзьях
                          </>
                        ) : (
                          <>
                            <Icon name="UserPlus" className="mr-2" size={18} />
                            Добавить
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="friends" className="space-y-6 animate-slide-up">
            {friends.length === 0 ? (
              <Card className="border-2 border-dashed border-primary/20 bg-white/60 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Icon name="Users" className="mx-auto mb-4 text-muted-foreground" size={64} />
                  <h3 className="text-xl font-heading font-bold mb-2">Пока нет друзей</h3>
                  <p className="text-muted-foreground mb-6">Найдите друзей во вкладке "Поиск"</p>
                  <Button onClick={() => setActiveTab('search')} className="bg-gradient-to-r from-primary to-secondary text-white">
                    <Icon name="Search" className="mr-2" size={18} />
                    Найти друзей
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-bold">Список друзей</h2>
                  {friends.map((friend) => (
                    <Card
                      key={friend.id}
                      className={`border-2 transition-all duration-300 hover:shadow-xl cursor-pointer bg-white/80 backdrop-blur-sm ${
                        selectedFriend?.id === friend.id ? 'border-primary shadow-lg' : 'border-primary/10'
                      }`}
                      onClick={() => setSelectedFriend(friend)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12 border-2 border-primary/20">
                                <AvatarImage src={friend.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">
                                  {friend.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {friend.status === 'online' && (
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-heading font-bold">{friend.name}</h3>
                              <p className="text-sm text-muted-foreground">{friend.phone}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFriend(friend.id);
                            }}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Icon name="UserMinus" size={18} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  {selectedFriend ? (
                    <>
                      <Card className="border-2 border-primary/20 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-16 w-16 border-4 border-primary/20">
                              <AvatarImage src={selectedFriend.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl font-bold">
                                {selectedFriend.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-heading font-bold">{selectedFriend.name}</h3>
                              <p className="text-muted-foreground">{selectedFriend.phone}</p>
                            </div>
                          </div>
                          <Button onClick={handleCall} className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white h-12 text-base font-medium">
                            <Icon name="Phone" className="mr-2" size={20} />
                            Позвонить
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-primary/20 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-heading font-bold mb-4">Чат с {selectedFriend.name}</h3>
                          <ScrollArea className="h-64 mb-4 p-4 border-2 border-primary/10 rounded-lg bg-gradient-to-br from-purple-50/50 to-blue-50/50">
                            <div className="space-y-3">
                              {messages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                                >
                                  <div
                                    className={`max-w-[70%] p-3 rounded-2xl ${
                                      msg.sender === 'me'
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm'
                                        : 'bg-white border-2 border-primary/10 rounded-bl-sm'
                                    }`}
                                  >
                                    <p className="text-sm">{msg.text}</p>
                                    <p
                                      className={`text-xs mt-1 ${
                                        msg.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'
                                      }`}
                                    >
                                      {msg.time}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Напишите сообщение..."
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              className="border-2 focus:border-primary"
                            />
                            <Button onClick={handleSendMessage} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white">
                              <Icon name="Send" size={18} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card className="border-2 border-dashed border-primary/20 bg-white/60 backdrop-blur-sm">
                      <CardContent className="p-12 text-center">
                        <Icon name="MessageCircle" className="mx-auto mb-4 text-muted-foreground" size={64} />
                        <h3 className="text-xl font-heading font-bold mb-2">Выберите друга</h3>
                        <p className="text-muted-foreground">Выберите друга из списка для общения</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="animate-slide-up">
            <Card className="border-2 border-primary/10 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                  <Avatar className="h-32 w-32 border-4 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary via-secondary to-accent text-white text-4xl font-bold">
                      Я
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-3xl font-heading font-bold mb-2">Мой профиль</h2>
                    <p className="text-muted-foreground">Статус: В сети</p>
                  </div>
                  <div className="grid grid-cols-3 gap-6 w-full max-w-md pt-6 border-t-2 border-primary/10">
                    <div>
                      <p className="text-3xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {friends.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Друзей</p>
                    </div>
                    <div>
                      <p className="text-3xl font-heading font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                        {messages.filter((m) => m.sender === 'me').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Сообщений</p>
                    </div>
                    <div>
                      <p className="text-3xl font-heading font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                        0
                      </p>
                      <p className="text-sm text-muted-foreground">Звонков</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="animate-slide-up">
            <Card className="border-2 border-primary/10 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-2xl font-heading font-bold">Настройки</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border-2 border-primary/10 rounded-lg hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon name="Bell" className="text-primary" size={24} />
                      <div>
                        <p className="font-medium">Уведомления</p>
                        <p className="text-sm text-muted-foreground">Управление уведомлениями</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" className="text-muted-foreground" size={20} />
                  </div>
                  <div className="flex items-center justify-between p-4 border-2 border-primary/10 rounded-lg hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon name="Lock" className="text-primary" size={24} />
                      <div>
                        <p className="font-medium">Приватность</p>
                        <p className="text-sm text-muted-foreground">Настройки конфиденциальности</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" className="text-muted-foreground" size={20} />
                  </div>
                  <div className="flex items-center justify-between p-4 border-2 border-primary/10 rounded-lg hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon name="Palette" className="text-primary" size={24} />
                      <div>
                        <p className="font-medium">Тема оформления</p>
                        <p className="text-sm text-muted-foreground">Выбор цветовой схемы</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" className="text-muted-foreground" size={20} />
                  </div>
                  <div className="flex items-center justify-between p-4 border-2 border-primary/10 rounded-lg hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon name="HelpCircle" className="text-primary" size={24} />
                      <div>
                        <p className="font-medium">Помощь</p>
                        <p className="text-sm text-muted-foreground">Справка и поддержка</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" className="text-muted-foreground" size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
